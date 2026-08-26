#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20 or later is required. Install it from https://nodejs.org/ and try again." >&2
  exit 1
fi

exec node "$SCRIPT_DIR/src/install.mjs" "$@"
