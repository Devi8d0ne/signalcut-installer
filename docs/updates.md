# SignalCut updates

The private `Devi8d0ne-YouTube-Admin` repository is the R&D source of truth. No application source is copied here when SignalCut changes.

For each approved version, the private release workflow:

1. requires a clean private `main` commit that is already pushed;
2. runs tests, type checks, and the production build;
3. packages the application and all required runtime components;
4. verifies the runtime inventory, final EULA, and third-party notices;
5. verifies a platform signature when the package format supports one;
6. signs `release.json` with the offline SignalCut release key; and
7. publishes immutable installers and metadata as a new GitHub Release here.

The update manifest URL remains stable:

```text
https://github.com/Devi8d0ne/signalcut-installer/releases/latest/download/release.json
```

SignalCut trusts the manifest only when its detached Ed25519 signature verifies with the public key pinned in this repository. It then selects exactly one matching operating-system/architecture installer and verifies its signed byte length and SHA-256 digest.

An update failure leaves the installed version untouched. A release may not silently downgrade the application or replace user projects and credentials. Database migrations must be versioned and backed up before application of a non-reversible change.

SignalCut 0.1.1 removes local AI runtimes and automatic model downloads. Original images use Codex-connected tools, source images use free cloud APIs, narration uses Microsoft Edge online neural voices, and the local package retains only bounded final assembly and application infrastructure.

SignalCut 0.1.2 fixes Windows startup so Studio opens only after the bridge, API, and web service pass health checks. It also moves the internal API away from Wrangler's common default port to avoid collisions with other local projects.

SignalCut 0.1.3 makes **Stop engine** a real cancellation boundary for active Codex turns, narration, downloads, browser/frame work, FFmpeg assembly, and queued heavy jobs. It also restores cinematic image motion with deliberate push, pull, and pan directions, uses faster bounded final assembly, preserves completed frames on retries, and makes the engine control available before slower provider checks finish.

SignalCut 0.2.0 adds **Express production mode**. Research, angle development, script, claim mapping, and metadata are completed in one durable editorial pass; safe work advances without an idle review countdown; independent cloud narration and asset work are instructed to overlap; and local FFmpeg remains limited to one bounded heavy job. It adds visible completion targets, interest-aware topic opportunity scoring, recovery checkpoints, per-turn change summaries, and granular selective revision across thirteen editorial and production surfaces. Final YouTube publishing remains owner-controlled and verified after upload.

SignalCut 0.2.3 improves the **ElevenLabs connection experience** with a guided provider card, clearer saved-key and voice-ID guidance, visible connection state, direct voice-library access, mobile layout improvements, and actionable local-service errors.

SignalCut 0.2.2 adds an **ElevenLabs usage system** driven by the provider's official subscription API. A second top rail shows remaining credits beneath Codex, the Usage workspace shows plan/reset/overage/voice-slot details, and each video independently selects its provider, voice direction, and v2/v3 model. The API key remains local and never appears in project artifacts, logs, or browser responses.

SignalCut 0.2.1 restored **ElevenLabs premium narration** as a first-class optional provider while retaining Microsoft online neural narration as the no-key fallback.
