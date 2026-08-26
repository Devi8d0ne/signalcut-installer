# SignalCut Installer

This is the public installation and update-verification repository for SignalCut. It intentionally contains **no SignalCut application source code, credentials, signing secrets, or private-repository access**.

> **Release status:** the installer shell is ready, but public installation remains disabled until the first proprietary SignalCut binary is packaged, signed, and published with the production release public key. The installer fails closed while that key or release is absent.

## Install with Codex

1. Clone this public repository.
2. Open the cloned folder in Codex.
3. Give Codex the instructions in [CODEX_INSTALL_PROMPT.md](CODEX_INSTALL_PROMPT.md).

Codex checks the operating system and dependencies, downloads only the official platform package, verifies the signed manifest and SHA-256 digest, and starts the platform installer. It must never request a private-repository token or ask you to paste application credentials into chat.

## Direct commands

Requires Node.js 20 or later:

```powershell
npm run check
npm run install
```

On macOS or Linux:

```bash
./install.sh --check
./install.sh
```

Use `npm run download` to verify and download a release without launching its platform installer.

## What remains local

After SignalCut starts, configure your own Codex login, Google OAuth client, YouTube authorization, Pexels key, and ElevenLabs key inside SignalCut's local interface. Do not put those credentials in this repository or a Codex conversation.

## Repository boundary

This repository is MIT-licensed installer infrastructure. SignalCut itself is proprietary and licensed separately under the EULA delivered with each release. Viewing or modifying this installer does not grant rights to SignalCut application source or binaries.

- [Setup and credential guidance](docs/setup.md)
- [Release hosting contract](docs/hosting.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Security policy](SECURITY.md)
