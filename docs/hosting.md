# Release hosting contract

This repository may publicly host approved proprietary SignalCut packages as GitHub Release assets without publishing the private source repository.

Every published version requires:

- `release.json` — exact release manifest;
- `release.json.sig` — detached Ed25519 signature of the exact manifest bytes;
- one or more platform packages named `signalcut-{version}-{platform}-{architecture}.{package}`;
- the SignalCut EULA; and
- required third-party license notices.

Supported platform names are `windows`, `macos`, and `linux`. Supported architectures are `x64` and `arm64`.

Release assets are immutable. Never replace bytes under an existing version. Publish a new version and manifest for every change, including a packaging-only correction.

The manifest's artifact URLs must use HTTPS. Redirects must also remain on HTTPS. The release manifest is trusted only after verification with the public key pinned in `keys/signalcut-release-public.pem`.

The public host receives binaries only. It must never receive private source, source maps, build intermediates, repository credentials, OAuth material, user credentials, or the release-signing private key.
