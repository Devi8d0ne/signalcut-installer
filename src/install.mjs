import { createHash, createPublicKey, verify } from "node:crypto";
import { createWriteStream } from "node:fs";
import { chmod, copyFile, mkdir, mkdtemp, readFile, readdir } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { Transform, Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(sourceDirectory, "..");
const MAX_METADATA_BYTES = 2 * 1024 * 1024;
const PLATFORM_MAP = { win32: "windows", darwin: "macos", linux: "linux" };
const SUPPORTED_ARCHITECTURES = new Set(["x64", "arm64"]);

function fail(message) {
  throw new Error(message);
}

export function detectEnvironment(platform = process.platform, architecture = process.arch) {
  const normalizedPlatform = PLATFORM_MAP[platform];
  if (!normalizedPlatform) fail(`Unsupported operating system: ${platform}`);
  if (!SUPPORTED_ARCHITECTURES.has(architecture)) {
    fail(`Unsupported CPU architecture: ${architecture}`);
  }
  return { platform: normalizedPlatform, architecture };
}

function parseVersion(value) {
  const match = String(value).match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!match) fail(`Invalid semantic version: ${value}`);
  return { numbers: match.slice(1, 4).map(Number), prerelease: match[4] ?? null };
}

export function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  for (let index = 0; index < 3; index += 1) {
    if (a.numbers[index] !== b.numbers[index]) return a.numbers[index] - b.numbers[index];
  }
  if (a.prerelease === b.prerelease) return 0;
  if (a.prerelease === null) return 1;
  if (b.prerelease === null) return -1;
  return a.prerelease.localeCompare(b.prerelease);
}

function strictBase64(value) {
  const normalized = value.trim();
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(normalized)) {
    fail("Release manifest signature is not valid base64");
  }
  return Buffer.from(normalized, "base64");
}

export function verifyAndParseManifest(manifestBytes, signatureText, publicKeyPem) {
  const publicKey = createPublicKey(publicKeyPem);
  if (publicKey.asymmetricKeyType !== "ed25519") {
    fail("Pinned release key is not an Ed25519 public key");
  }
  const signature = strictBase64(signatureText);
  if (!verify(null, manifestBytes, publicKey, signature)) {
    fail("Release manifest signature is invalid");
  }

  const manifest = JSON.parse(manifestBytes.toString("utf8"));
  const keyId = createHash("sha256")
    .update(publicKey.export({ type: "spki", format: "der" }))
    .digest("hex");
  if (manifest?.schemaVersion !== 1 || manifest?.product !== "SignalCut") {
    fail("Unsupported release manifest schema or product");
  }
  if (manifest?.signing?.algorithm !== "Ed25519" || manifest?.signing?.keyId !== keyId) {
    fail("Release manifest signing identity does not match the pinned key");
  }
  parseVersion(manifest.version);
  parseVersion(manifest.minimumInstallerVersion);
  if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) {
    fail("Release manifest contains no artifacts");
  }
  return manifest;
}

export function selectArtifact(manifest, environment) {
  const matches = manifest.artifacts.filter(
    (artifact) =>
      artifact?.platform === environment.platform &&
      artifact?.architecture === environment.architecture,
  );
  if (matches.length !== 1) {
    fail(
      `Expected exactly one ${environment.platform}/${environment.architecture} artifact; found ${matches.length}`,
    );
  }
  const artifact = matches[0];
  if (path.basename(artifact.filename) !== artifact.filename) {
    fail("Release artifact filename is unsafe");
  }
  if (!Number.isSafeInteger(artifact.size) || artifact.size <= 0) {
    fail("Release artifact size is invalid");
  }
  if (!/^[a-f0-9]{64}$/.test(artifact.sha256)) {
    fail("Release artifact SHA-256 is invalid");
  }
  const url = new URL(artifact.url);
  if (url.protocol !== "https:") fail("Release artifact URL must use HTTPS");
  return artifact;
}

async function fetchMetadata(urlValue, label) {
  const url = new URL(urlValue);
  if (url.protocol !== "https:") fail(`${label} URL must use HTTPS`);
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) fail(`${label} download failed with HTTP ${response.status}`);
  if (new URL(response.url).protocol !== "https:") fail(`${label} redirected away from HTTPS`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_METADATA_BYTES) {
    fail(`${label} has an invalid size`);
  }
  return bytes;
}

async function downloadAndVerify(artifact, destination) {
  const response = await fetch(artifact.url, { redirect: "follow" });
  if (!response.ok || !response.body) {
    fail(`Release artifact download failed with HTTP ${response.status}`);
  }
  if (new URL(response.url).protocol !== "https:") {
    fail("Release artifact redirected away from HTTPS");
  }

  let received = 0;
  const digest = createHash("sha256");
  const meter = new Transform({
    transform(chunk, _encoding, callback) {
      received += chunk.length;
      if (received > artifact.size) {
        callback(new Error("Release artifact exceeds its signed byte length"));
        return;
      }
      digest.update(chunk);
      callback(null, chunk);
    },
  });
  await pipeline(Readable.fromWeb(response.body), meter, createWriteStream(destination, { flags: "wx" }));

  if (received !== artifact.size) fail("Release artifact byte length does not match manifest");
  if (digest.digest("hex") !== artifact.sha256) fail("Release artifact SHA-256 does not match manifest");
}

function commandStatus(command) {
  const versionArguments = command === "ffmpeg" || command === "ffprobe" ? ["-version"] : ["--version"];
  const result = spawnSync(command, versionArguments, { encoding: "utf8", shell: false });
  return {
    command,
    available: !result.error && result.status === 0,
    version: (result.stdout || result.stderr || "").split(/\r?\n/, 1)[0].trim(),
  };
}

export function checkDependencies(requiredCommands) {
  const nodeMajor = Number(process.versions.node.split(".")[0]);
  const results = [
    { command: "node", available: nodeMajor >= 20, version: process.version },
    ...requiredCommands.map(commandStatus),
  ];
  for (const result of results) {
    process.stdout.write(`${result.available ? "PASS" : "MISSING"} ${result.command}${result.version ? ` — ${result.version}` : ""}\n`);
  }
  return results.every((result) => result.available);
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: false });
  if (result.error) fail(`Could not start ${command}: ${result.error.message}`);
  if (result.status !== 0) fail(`${command} exited with status ${result.status}`);
}

async function findFile(directory, filename) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = await findFile(candidate, filename);
      if (nested) return nested;
    } else if (entry.name.toLowerCase() === filename.toLowerCase()) {
      return candidate;
    }
  }
  return null;
}

async function launchInstaller(artifactPath, environment, version) {
  const lower = artifactPath.toLowerCase();
  if (environment.platform === "windows" && lower.endsWith(".zip")) {
    const installRoot = path.join(process.env.LOCALAPPDATA || homedir(), "SignalCut", "Application", version);
    await mkdir(installRoot, { recursive: true });
    run("tar.exe", ["-x", "-f", artifactPath, "-C", installRoot]);
    const launcher = await findFile(installRoot, "Start SignalCut.cmd");
    if (!launcher) fail("The verified SignalCut archive does not contain Start SignalCut.cmd");
    run("cmd.exe", ["/d", "/c", "start", "", launcher]);
    return;
  }
  if (environment.platform === "windows" && lower.endsWith(".msi")) {
    run("msiexec.exe", ["/i", artifactPath]);
    return;
  }
  if (environment.platform === "windows" && lower.endsWith(".exe")) {
    run(artifactPath, []);
    return;
  }
  if (environment.platform === "macos" && (lower.endsWith(".pkg") || lower.endsWith(".dmg"))) {
    run("open", [artifactPath]);
    return;
  }
  if (environment.platform === "linux" && lower.endsWith(".appimage")) {
    const installDirectory = path.join(homedir(), ".local", "bin");
    const installedPath = path.join(installDirectory, "signalcut.AppImage");
    await mkdir(installDirectory, { recursive: true });
    await copyFile(artifactPath, installedPath);
    await chmod(installedPath, 0o755);
    process.stdout.write(`Installed ${installedPath}\n`);
    run(installedPath, []);
    return;
  }
  if (environment.platform === "linux" && (lower.endsWith(".deb") || lower.endsWith(".rpm"))) {
    run("xdg-open", [artifactPath]);
    return;
  }
  fail(`Unsupported package type for ${environment.platform}: ${path.basename(artifactPath)}`);
}

function parseArgs(argv) {
  const allowed = new Set(["--check", "--download-only"]);
  for (const argument of argv) if (!allowed.has(argument)) fail(`Unknown argument: ${argument}`);
  return { checkOnly: argv.includes("--check"), downloadOnly: argv.includes("--download-only") };
}

async function loadConfiguration() {
  return JSON.parse(await readFile(path.join(repositoryRoot, "installer.config.json"), "utf8"));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = await loadConfiguration();
  const environment = detectEnvironment();
  process.stdout.write(`SignalCut installer ${config.installerVersion} — ${environment.platform}/${environment.architecture}\n`);

  const dependenciesReady = checkDependencies(config.requiredCommands ?? []);
  if (args.checkOnly) {
    if (!dependenciesReady) process.exitCode = 1;
    return;
  }
  if (!dependenciesReady) fail("Required dependencies are missing; installation stopped");

  const publicKeyPath = path.resolve(repositoryRoot, config.publicKeyPath);
  if (!publicKeyPath.startsWith(`${repositoryRoot}${path.sep}`)) fail("Configured public-key path is unsafe");
  let publicKeyPem;
  try {
    publicKeyPem = await readFile(publicKeyPath, "utf8");
  } catch {
    fail("Production release public key is not installed; no release can be trusted yet");
  }

  const [manifestBytes, signatureBytes] = await Promise.all([
    fetchMetadata(config.manifestUrl, "Release manifest"),
    fetchMetadata(config.signatureUrl, "Release signature"),
  ]);
  const manifest = verifyAndParseManifest(manifestBytes, signatureBytes.toString("utf8"), publicKeyPem);
  if (compareVersions(config.installerVersion, manifest.minimumInstallerVersion) < 0) {
    fail(`Installer ${config.installerVersion} is older than required ${manifest.minimumInstallerVersion}`);
  }
  const artifact = selectArtifact(manifest, environment);
  const downloadDirectory = await mkdtemp(path.join(tmpdir(), "signalcut-"));
  const artifactPath = path.join(downloadDirectory, artifact.filename);
  await downloadAndVerify(artifact, artifactPath);
  process.stdout.write(`Verified SignalCut ${manifest.version}: ${artifactPath}\n`);

  if (!args.downloadOnly) await launchInstaller(artifactPath, environment, manifest.version);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    process.stderr.write(`INSTALLATION STOPPED: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
