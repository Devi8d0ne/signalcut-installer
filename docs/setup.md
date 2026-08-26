# Local setup

## Prerequisites

- Node.js 20 or later to run this public installer.
- The Codex desktop app or another supported local Codex authentication environment.
- FFmpeg and FFprobe on `PATH` until they are bundled with the SignalCut platform package.
- A supported 64-bit Windows, macOS, or Linux machine.

Run `npm run check` to inspect prerequisites without downloading or changing anything.

## Credentials

The installer does not collect application credentials. After verified installation, SignalCut's local interface guides the operator through:

1. Their own local Codex login.
2. Their own Google Cloud project and YouTube Data API v3 OAuth Desktop client.
3. Their own YouTube channel authorization.
4. Optional Pexels and ElevenLabs credentials.

Enter credentials only into SignalCut's local interface. Do not paste them into Codex, commit them to this repository, place them in an issue, or send them to a SignalCut download host.

## Data location

SignalCut stores mutable project data and credentials locally, outside its signed installation directory. Uninstalling the application must not silently remove project data; removal of local data should be a separate explicit action.
