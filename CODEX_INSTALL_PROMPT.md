# Codex installation prompt

Use the following prompt from the root of a trusted clone of this repository:

```text
Install SignalCut using only the files and documented verification flow in this repository.

1. Read README.md, installer.config.json, docs/setup.md, and docs/troubleshooting.md.
2. Run the dependency check for this operating system.
3. Do not request, search for, or use access to SignalCut's private source repository.
4. Do not ask me to paste API keys, OAuth secrets, refresh tokens, signing keys, or account credentials into chat or the terminal.
5. Download only the release manifest and signature configured in installer.config.json.
6. Require the pinned Ed25519 public key in keys/signalcut-release-public.pem. Never substitute a key downloaded with the release.
7. Verify the manifest signature before trusting any artifact URL or checksum.
8. Select only the artifact matching this operating system and CPU architecture.
9. Verify the complete artifact's byte length and SHA-256 digest before opening it.
10. Stop and explain the exact problem if any dependency, key, signature, checksum, platform match, or HTTPS requirement fails. Do not bypass or weaken a failed check.
11. Launch the verified platform installer. After SignalCut starts, direct me to its local setup screen for my own Codex, Google OAuth, YouTube, Pexels, and ElevenLabs configuration.
12. Confirm what was installed, its version, and where the verified package was downloaded. Never claim installation succeeded unless the installer completed successfully.
```

Codex may help install missing public prerequisites with the operator's approval. It may not clone private source, compile SignalCut from source, replace the pinned trust key, disable verification, or collect user credentials.
