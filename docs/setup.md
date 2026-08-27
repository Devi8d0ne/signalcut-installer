# Local setup

## Prerequisites

- A supported 64-bit Windows, macOS, or Linux machine.
- The Codex desktop app or another supported local Codex authentication environment.
- An authenticated Codex account.
- Internet access for Codex and user-connected services.

SignalCut bundles its runtime, restricted FFmpeg/FFprobe final-assembly tools, browser runtime, local database, migrations, and updater. Node.js, npm, Git, Wrangler, Python, and system media tools are not end-user prerequisites. SignalCut does not bundle or download local AI models or Python AI environments.

The Windows x64 portable release is a ZIP. Extract the complete directory and run `Start SignalCut.vbs`. It starts the bridge, API, and web service hidden, waits for all three health checks, and only then opens Studio in its dedicated app window—not a normal browser tab—with Eco mode enabled and production paused. Run `Stop SignalCut.vbs` to stop every SignalCut service. SignalCut does not register a Windows startup entry.

Inside Studio, **Stop engine** preserves projects and approvals while cancelling active production work and the queued heavy-work backlog. The separate `Stop SignalCut.vbs` shortcut shuts down the complete local application stack.

## Credentials

The installer does not collect application credentials. After verified installation, SignalCut's local interface guides the operator through:

1. Their own local Codex login.
2. Their own Google Cloud project and YouTube Data API v3 OAuth Desktop client.
3. Their own YouTube channel authorization.
4. Their optional free Pexels API key for additional image references.
5. Any optional user-owned services supported by that SignalCut version.

ElevenLabs premium narration is optional and configured locally with the operator's API key and male/female voice IDs. Microsoft online neural narration remains available without an account or API key. SignalCut's default production style is a motion video assembled from original and sourced images, not live-action footage.

Enter credentials only into SignalCut's local interface. Do not paste them into Codex, commit them to this repository, place them in an issue, or send them to a SignalCut download host.

## Data location

SignalCut stores mutable project data and credentials locally, outside its signed installation directory. Uninstalling the application must not silently remove project data; removal of local data should be a separate explicit action.
