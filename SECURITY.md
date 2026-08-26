# Security policy

## Report a vulnerability

Do not open a public issue for a vulnerability that could expose credentials, signing material, release integrity, or private SignalCut implementation details. Report it through this repository's GitHub **Report a vulnerability** form.

Do not include real credentials, tokens, signing keys, or private source in a report.

## Installer trust model

The production Ed25519 public key is pinned in this repository. A release is accepted only when:

- the manifest is fetched over HTTPS;
- its detached Ed25519 signature verifies with the pinned key;
- the manifest names exactly one compatible platform artifact;
- the artifact URL uses HTTPS;
- the downloaded byte length and SHA-256 digest match the signed manifest; and
- the artifact uses a supported platform package type.

The signing private key must never appear in this repository, a GitHub issue, a workflow log, or a release asset. Checksums without a valid manifest signature are not trusted.
