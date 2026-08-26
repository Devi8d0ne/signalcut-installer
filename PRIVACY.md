# SignalCut Privacy Disclosure

**Effective date: August 26, 2026**

SignalCut is a local-first desktop web application published by Deviated Holdings, Inc., a Florida corporation. This disclosure describes the public release available through `Devi8d0ne/signalcut-installer`.

## Data SignalCut keeps locally

SignalCut stores project records, local D1 data, prompts, research notes, scripts, source and rights records, media, narration, thumbnails, renders, usage records, settings, Google OAuth client material, and YouTube refresh tokens on the operator's machine. These paths are not included in the public installer repository or release metadata.

## Data sent to services selected by the operator

SignalCut sends information directly from the operator's machine when necessary to use a selected service:

- prompts, project context, and tool requests to the operator's authenticated Codex/OpenAI environment;
- OAuth, channel, playlist, video, thumbnail, and publishing requests to Google and YouTube;
- search and acquisition requests to selected media sources;
- model-file requests to model hosts when an optional local model is downloaded; and
- signed release-metadata requests to the official GitHub release repository.

Those providers process data under their own terms and privacy policies. Operators choose which accounts and services to connect.

## Publisher telemetry

The current release does not send a publisher-operated advertising, behavioral analytics, or project-content telemetry feed. The local usage ledger is displayed to the operator and remains local. GitHub and connected third-party services may independently record ordinary request metadata under their policies.

## Control and deletion

Disconnecting a service stops new requests but may not revoke an already-issued provider token. Operators can revoke Google access from their Google Account and remove local SignalCut credentials and project data from their machine. Uninstalling the application and deleting its local data directory removes SignalCut's local copy; connected providers may retain data under their own policies.

## Security

No local application can guarantee absolute security. Keep the operating system updated, protect the user account, do not expose SignalCut's loopback services to a network, and do not commit or share runtime credential files.

## Changes and contact

Material changes to these practices will be disclosed with the applicable release before they take effect. Questions may be sent to `fholder.us@gmail.com` or by tracked mail to Deviated Holdings, Inc., 4755 Chicago St, Cocoa, Florida 32927, USA.
