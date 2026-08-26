# Local setup

## Prerequisites

- A supported 64-bit Windows, macOS, or Linux machine.
- The Codex desktop app or another supported local Codex authentication environment.
- An authenticated Codex account.
- Internet access for Codex and user-connected services.

SignalCut bundles its runtime, FFmpeg/FFprobe, browser automation, local database, migrations, Python/Qwen3-TTS production voice runtime, Kokoro preview model, and updater. Node.js, npm, Git, Wrangler, Python, and system media tools are not end-user prerequisites.

The Windows x64 portable release is a ZIP. Extract the complete directory and run `Start SignalCut.cmd`. First launch automatically downloads the pinned open-source Qwen3-TTS model weights (about 4 GB) into the local SignalCut data directory. This requires internet access but no provider account, credits, subscription, or API key.

## Credentials

The installer does not collect application credentials. After verified installation, SignalCut's local interface guides the operator through:

1. Their own local Codex login.
2. Their own Google Cloud project and YouTube Data API v3 OAuth Desktop client.
3. Their own YouTube channel authorization.
4. Any optional user-owned services supported by that SignalCut version.

Enter credentials only into SignalCut's local interface. Do not paste them into Codex, commit them to this repository, place them in an issue, or send them to a SignalCut download host.

## Data location

SignalCut stores mutable project data and credentials locally, outside its signed installation directory. Uninstalling the application must not silently remove project data; removal of local data should be a separate explicit action.
