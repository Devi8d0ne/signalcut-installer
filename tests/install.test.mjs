import { createHash, createPublicKey, generateKeyPairSync, sign } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

import {
  compareVersions,
  detectEnvironment,
  selectArtifact,
  verifyAndParseManifest,
} from "../src/install.mjs";

function signedFixture() {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
  const keyId = createHash("sha256")
    .update(publicKey.export({ type: "spki", format: "der" }))
    .digest("hex");
  const manifest = {
    schemaVersion: 1,
    product: "SignalCut",
    version: "1.2.3",
    publishedAt: "2026-08-26T00:00:00.000Z",
    minimumInstallerVersion: "0.1.0",
    signing: { algorithm: "Ed25519", keyId },
    artifacts: [
      {
        platform: "windows",
        architecture: "x64",
        filename: "signalcut-1.2.3-windows-x64.msi",
        url: "https://downloads.example.com/signalcut-1.2.3-windows-x64.msi",
        size: 123,
        sha256: "a".repeat(64),
      },
    ],
  };
  const bytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  const signature = sign(null, bytes, privateKey).toString("base64");
  return { bytes, signature, publicKeyPem };
}

test("detects supported environments", () => {
  assert.deepEqual(detectEnvironment("win32", "x64"), {
    platform: "windows",
    architecture: "x64",
  });
  assert.throws(() => detectEnvironment("freebsd", "x64"), /Unsupported operating system/);
});

test("verifies the signed manifest before selecting an artifact", () => {
  const fixture = signedFixture();
  const manifest = verifyAndParseManifest(
    fixture.bytes,
    fixture.signature,
    fixture.publicKeyPem,
  );
  assert.equal(selectArtifact(manifest, { platform: "windows", architecture: "x64" }).filename,
    "signalcut-1.2.3-windows-x64.msi");
});

test("rejects manifest tampering", () => {
  const fixture = signedFixture();
  const modified = Buffer.from(fixture.bytes.toString().replace("1.2.3", "9.9.9"));
  assert.throws(
    () => verifyAndParseManifest(modified, fixture.signature, fixture.publicKeyPem),
    /signature is invalid/,
  );
});

test("requires exactly one platform match and safe HTTPS metadata", () => {
  const fixture = signedFixture();
  const manifest = verifyAndParseManifest(
    fixture.bytes,
    fixture.signature,
    fixture.publicKeyPem,
  );
  assert.throws(
    () => selectArtifact(manifest, { platform: "macos", architecture: "arm64" }),
    /found 0/,
  );
  manifest.artifacts[0].url = "http://downloads.example.com/signalcut.msi";
  assert.throws(
    () => selectArtifact(manifest, { platform: "windows", architecture: "x64" }),
    /must use HTTPS/,
  );
});

test("compares installer minimum versions", () => {
  assert.ok(compareVersions("0.2.0", "0.1.9") > 0);
  assert.ok(compareVersions("1.0.0-beta.1", "1.0.0") < 0);
  assert.equal(compareVersions("1.2.3", "1.2.3"), 0);
});

test("pins the production Ed25519 release identity", () => {
  const pem = readFileSync(new URL("../keys/signalcut-release-public.pem", import.meta.url), "utf8");
  const key = createPublicKey(pem);
  assert.equal(key.asymmetricKeyType, "ed25519");
  assert.equal(
    createHash("sha256").update(key.export({ type: "spki", format: "der" })).digest("hex"),
    "9c15b2991e01adb232e46249c27b0f6112a7dcbf38b0e2d4f6762b8991c37972",
  );
});
