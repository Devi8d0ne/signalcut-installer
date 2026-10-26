import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

async function runCheck({ installedVersion = "0.2.7", releaseVersion = "0.2.8", minimumInstallerVersion = "0.1.0", tamper = false, args = ["--check-update"] } = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "signalcut-update-test-"));
  try {
    const resources = path.join(root, "resources");
    await mkdir(resources);
    await copyFile(new URL("../src/install.mjs", import.meta.url), path.join(resources, "update-verifier.mjs"));
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");
    await writeFile(path.join(resources, "signalcut-release-public.pem"), publicKey.export({ type: "spki", format: "pem" }));
    const environment = { platform: { win32: "windows", darwin: "macos", linux: "linux" }[process.platform], architecture: process.arch };
    const manifest = {
      schemaVersion: 1, product: "SignalCut", version: releaseVersion, minimumInstallerVersion,
      signing: { algorithm: "Ed25519", keyId: createHash("sha256").update(publicKey.export({ type: "spki", format: "der" })).digest("hex") },
      artifacts: [{ ...environment, filename: `signalcut-${releaseVersion}-${environment.platform}-${environment.architecture}.zip`, url: "https://example.test/package.zip", size: 123, sha256: "a".repeat(64) }],
    };
    const bytes = Buffer.from(JSON.stringify(manifest));
    const signature = sign(null, bytes, privateKey).toString("base64");
    await writeFile(path.join(root, "manifest.json"), tamper ? bytes.toString().replace(releaseVersion, "9.9.9") : bytes);
    await writeFile(path.join(root, "manifest.sig"), signature);
    await writeFile(path.join(root, "installer.config.json"), JSON.stringify({
      installerVersion: "0.2.7", ...(installedVersion ? { installedVersion } : {}),
      manifestUrl: "https://example.test/manifest.json", signatureUrl: "https://example.test/manifest.sig",
      publicKeyPath: "resources/signalcut-release-public.pem", requiredCommands: [],
    }));
    const preload = path.join(root, "fetch-fixture.mjs");
    await writeFile(preload, `import { readFile } from "node:fs/promises";\nglobalThis.fetch = async (url) => {\n const filename = new URL(url).pathname.slice(1);\n if (!["manifest.json", "manifest.sig"].includes(filename)) throw new Error("Unexpected artifact download or network request");\n const bytes = await readFile(new URL(filename, import.meta.url));\n return { ok: true, status: 200, url: String(url), arrayBuffer: async () => bytes };\n};\n`);
    return spawnSync(process.execPath, ["--import", pathToFileURL(preload).href, path.join(resources, "update-verifier.mjs"), ...args], { encoding: "utf8", timeout: 10_000 });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("packaged metadata-only check verifies a newer release without downloading or launching it", async () => {
  const result = await runCheck();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Update available: SignalCut 0\.2\.8 \(installed 0\.2\.7\)/);
  assert.match(result.stdout, /Verified download: https:\/\/example.test\/package.zip/);
});

test("update check reports an equal release as up to date, with installer-version fallback", async () => {
  const result = await runCheck({ installedVersion: null, releaseVersion: "0.2.7" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /0\.2\.7 is up to date/);
});

test("update check leaves a newer installation alone", async () => {
  const result = await runCheck({ releaseVersion: "0.2.6" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /no downgrade is needed/);
});

test("installed packages refuse a downgrade before downloading any artifact", async () => {
  const result = await runCheck({ releaseVersion: "0.2.6", args: [] });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Refusing to downgrade SignalCut 0\.2\.7 to 0\.2\.6/);
});

test("metadata-only update checks reject tampered manifests", async () => {
  const result = await runCheck({ tamper: true });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /signature is invalid/);
  assert.doesNotMatch(result.stdout, /Update available/);
});

test("metadata-only update checks enforce the minimum installer version", async () => {
  const result = await runCheck({ minimumInstallerVersion: "0.3.0" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /older than required 0\.3\.0/);
});
