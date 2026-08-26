# Pinned release key

The production release verifier pins:

```text
signalcut-release-public.pem
```

This is the Ed25519 public key whose private counterpart is held separately by the SignalCut release owner. Its key ID is:

```text
9c15b2991e01adb232e46249c27b0f6112a7dcbf38b0e2d4f6762b8991c37972
```

The installer fails closed when the file is absent, invalid, or does not match the signed manifest.

Never place a private key in this repository. Never replace the pinned public key with a key downloaded from a release, redirect, issue, pull request, or user-provided URL.
