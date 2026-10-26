# Local setup

## Prerequisites

- A Windows x64 machine. Current releases do not include macOS, Linux, or Windows ARM64 packages.
- The Codex desktop app or another supported local Codex authentication environment.
- An authenticated Codex account.
- Internet access for Codex and user-connected services.

SignalCut bundles its runtime, restricted FFmpeg/FFprobe final-assembly tools, browser runtime, local database, migrations, and signed update checker. Node.js, npm, Git, Wrangler, Python, and system media tools are not end-user prerequisites. SignalCut does not bundle or download local AI models or Python AI environments.

The Windows x64 portable release is a ZIP. Extract the complete directory and run `Start SignalCut.vbs`. It starts the bridge, API, and web service hidden, waits for all three health checks, and then opens Studio with Eco mode enabled and production paused. If Google Chrome is installed, Studio opens in a new Chrome window; use Chrome's install-app option when available to add a dedicated SignalCut app shortcut. Otherwise, the bundled browser opens Studio in a dedicated app window. Run `Stop SignalCut.vbs` to stop every SignalCut service. SignalCut does not register a Windows startup entry.

Inside Studio, **Stop engine** preserves projects and approvals while cancelling active production work and the queued heavy-work backlog. The separate `Stop SignalCut.vbs` shortcut shuts down the complete local application stack.

## Updating

Version 0.2.7 and later includes `Check for updates.cmd`. Run it from the extracted package to check signed release metadata using the bundled runtime. It reports whether an update is available and does not download or install anything.

For an update, run `Stop SignalCut.vbs`, download and verify the newer release from GitHub, and extract the complete ZIP into a separate folder. Launch the new copy with `Start SignalCut.vbs`. Keep `%LOCALAPPDATA%\SignalCut`, where projects and connected credentials are stored. Versions before 0.2.7 can also update using this manual process.

## Credentials

The installer does not collect application credentials. After verified installation, SignalCut's local interface guides the operator through:

1. Their own local Codex login.
2. Their own Google Cloud project and YouTube Data API v3 OAuth Desktop client.
3. Their own YouTube channel authorization.
4. Their optional free Pexels API key for additional image references.
5. Any optional user-owned services supported by that SignalCut version.

ElevenLabs premium narration is optional and configured locally with the operator's API key and male/female voice IDs. Each video can then select Default, ElevenLabs, or Microsoft plus its voice direction and Eleven model. SignalCut displays the provider's live credit balance under the Codex bar. Microsoft online neural narration remains available without an account or API key.

Enter credentials only into SignalCut's local interface. Do not paste them into Codex, commit them to this repository, place them in an issue, or send them to a SignalCut download host.

## Data location

SignalCut stores mutable project data and credentials locally, outside its signed installation directory. Uninstalling the application must not silently remove project data; removal of local data should be a separate explicit action.
