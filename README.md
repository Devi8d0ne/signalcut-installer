# SignalCut Installer

[![Installer checks](https://github.com/Devi8d0ne/signalcut-installer/actions/workflows/installer-checks.yml/badge.svg)](https://github.com/Devi8d0ne/signalcut-installer/actions/workflows/installer-checks.yml)
[![Latest release](https://img.shields.io/github/v/release/Devi8d0ne/signalcut-installer?display_name=tag&include_prereleases)](https://github.com/Devi8d0ne/signalcut-installer/releases)
[![Local first](https://img.shields.io/badge/runtime-local--first-42c984)](#what-remains-local)
[![Codex powered](https://img.shields.io/badge/powered%20by-Codex-ef5b5b)](CODEX_INSTALL_PROMPT.md)

> Turn a YouTube brief into researched, written, designed, approval-ready faceless videos from one local Codex-powered studio.

![SignalCut — From brief to broadcast](docs/images/signalcut-social-preview-1280x640.jpg)

<details>
<summary>See the SignalCut Studio workspace</summary>

![SignalCut Studio project workspace](docs/images/signalcut-studio.png)

</details>

This is the public installation and update-verification repository for SignalCut. It intentionally contains **no SignalCut application source code, credentials, signing secrets, or private-repository access**.

> **Release status:** SignalCut 0.2.2 adds live ElevenLabs credit visibility and per-video provider, voice, and model controls while retaining Microsoft neural narration as the no-key fallback.

## Install SignalCut

1. Open the repository's [Releases](https://github.com/Devi8d0ne/signalcut-installer/releases) page.
2. Download the latest `signalcut-*-windows-x64.zip` asset.
3. Verify it with the signed `release.json` and `release.json.sig`, or use the reviewed [Codex installation prompt](CODEX_INSTALL_PROMPT.md).
4. Extract the complete folder and double-click `Start SignalCut.vbs` for a hidden, on-demand launch.
5. Connect your own Codex, Google, YouTube, and optional free Pexels credentials in SignalCut. Use `Stop SignalCut.vbs` to stop every SignalCut service.

Or clone this installer repository, open it in Codex Desktop, and use the reviewed [Codex installation prompt](CODEX_INSTALL_PROMPT.md). Codex follows the same signed-manifest and checksum verification path; it never receives SignalCut's private source or your service credentials.

The SignalCut package bundles its application runtime, restricted FFmpeg/FFprobe final-assembly tools, browser runtime, local database runtime and migrations, and updater. It does not bundle or download local AI models or a Python AI environment. End users do not install Node.js, npm, Git, Wrangler, Python, or media tooling. Original images use Codex-connected tools, source images use free cloud APIs, and narration uses an owner-connected ElevenLabs account when enabled or Microsoft Edge online neural voices as the no-key fallback.

SignalCut never registers itself to start with Windows. It launches only when the operator starts it, uses the Eco resource profile, and keeps the production engine paused until the operator explicitly starts production.

The portable ZIP is protected by the signed SignalCut release manifest and checksum. It is not yet an Authenticode-signed `.exe`; Windows may show the normal warning for a downloaded command file.

Codex Desktop itself is not bundled. A supported Codex installation and authenticated Codex account are required to use SignalCut. User-owned Google, YouTube, optional Pexels, and other service credentials are connected locally after first launch.

## Optional Codex guidance

Codex can guide a user through choosing and validating an official release using [CODEX_INSTALL_PROMPT.md](CODEX_INSTALL_PROMPT.md). It must never clone SignalCut's private source, install development dependencies, replace the pinned release key, or collect application credentials.

## Updates

Every approved private R&D version produces a new immutable, signed GitHub Release here. SignalCut checks the signed release manifest and offers the compatible update. Application source never enters this repository.

See [updates and release channels](docs/updates.md) for the exact behavior.

## Maintainer verification code

The Node.js code in `src/` is a public reference implementation and security test for signed manifest selection. It is not the normal end-user installer and is not a SignalCut runtime dependency.

## What remains local

After SignalCut starts, connect your Codex session, Google OAuth client, YouTube authorization, optional free Pexels API key, and any other supported user-owned services inside SignalCut's local interface. Do not put those credentials in this repository or a Codex conversation.

SignalCut's working database, channel authorization, source ledger, scripts, narration, frames, thumbnails, renders, and usage ledger remain on the operator's machine. Local services bind to loopback addresses rather than becoming a hosted multi-user service.

## What SignalCut is built to do

- Finish faster with Express mode: one researched editorial package, concurrent cloud production work, bounded local assembly, and final owner approval.
- Target 8–15 minute Shorts and 25–45 minute long-form production without increasing local CPU or heavy-job concurrency.
- Maintain one durable Codex thread across research, creative development, writing, design, and release.
- Run owner-defined content lanes mapped to real YouTube playlists, categories, formats, and schedules.
- Research current sources, record citations and rights, and avoid generic filler footage.
- Produce scripts, chapters, captions, metadata, focused hashtags, thumbnails, narration, and production manifests.
- Build image-driven motion videos from Codex-generated frames and rights-cleared free image references, with ElevenLabs premium voiceover or Microsoft online narration plus optional rights-cleared ambience.
- Support selective reproduction across research, claims, hook, script, metadata, voiceover, music, mix, frames, scenes, cover, captions, and timing.
- Write change summaries, claim maps, and recovery checkpoints so valid work survives retries and interrupted sessions.
- Keep autonomous safe stages behind the selected approval policy and final YouTube publishing under owner control.
- Track exact Codex usage plus the connected ElevenLabs plan balance, remaining credits, reset time, overage, and voice slots.

## Repository boundary

This repository is MIT-licensed installer infrastructure. SignalCut itself is proprietary and licensed separately under the EULA delivered with each release. Viewing or modifying this installer does not grant rights to SignalCut application source or binaries.

- [SignalCut EULA](SIGNALCUT-EULA.md)
- [Privacy disclosure](PRIVACY.md)
- [Setup and credential guidance](docs/setup.md)
- [Release hosting contract](docs/hosting.md)
- [Update behavior](docs/updates.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Security policy](SECURITY.md)
