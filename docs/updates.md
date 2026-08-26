# SignalCut updates

The private `Devi8d0ne-YouTube-Admin` repository is the R&D source of truth. No application source is copied here when SignalCut changes.

For each approved version, the private release workflow:

1. requires a clean private `main` commit that is already pushed;
2. runs tests, type checks, and the production build;
3. packages the application and all required runtime components;
4. verifies the runtime inventory, final EULA, and third-party notices;
5. verifies the operating-system signature or notarization;
6. signs `release.json` with the offline SignalCut release key; and
7. publishes immutable installers and metadata as a new GitHub Release here.

The update manifest URL remains stable:

```text
https://github.com/Devi8d0ne/signalcut-installer/releases/latest/download/release.json
```

SignalCut trusts the manifest only when its detached Ed25519 signature verifies with the public key pinned in this repository. It then selects exactly one matching operating-system/architecture installer and verifies its signed byte length and SHA-256 digest.

An update failure leaves the installed version untouched. A release may not silently downgrade the application or replace user projects and credentials. Database migrations must be versioned and backed up before application of a non-reversible change.

Large optional components, such as a GPU narration model pack, may be separate signed artifacts. The base installer must retain a bundled working fallback and must clearly request approval before downloading an optional pack.
