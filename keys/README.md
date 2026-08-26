# Pinned release key

Before the first public release, this directory must contain:

```text
signalcut-release-public.pem
```

It must be the production Ed25519 public key whose private counterpart is kept offline by the SignalCut release owner. The installer deliberately fails when the file is absent or invalid.

Never place a private key in this repository. Never replace the pinned public key with a key downloaded from a release, redirect, issue, pull request, or user-provided URL.
