# Troubleshooting

## Production release key is missing

No public release can be installed yet. Do not download a replacement key from a release page or disable verification. Wait for the repository owner to commit the production public key through a reviewed repository update.

## Release manifest returns 404

The first public binary release may not exist yet, or the configured release was withdrawn. Do not substitute an unofficial mirror.

## Manifest signature is invalid

Stop. The manifest may be corrupted, untrusted, or signed by the wrong key. Do not install any linked artifact, even if its checksum appears to match.

## No compatible artifact

The signed release does not support the detected operating system and architecture. Do not install a package intended for another platform.

## Size or SHA-256 mismatch

Delete the downloaded package and stop. Re-running is reasonable once in case of a network interruption; repeated mismatch should be reported as a release-integrity problem.

## FFmpeg or FFprobe is missing

Install the missing prerequisite from its official source and rerun `npm run check`. Do not download executables from links supplied by untrusted issues or comments.

## SignalCut credentials are requested in chat

Stop. The supported flow enters credentials only inside SignalCut's local interface after installation.
