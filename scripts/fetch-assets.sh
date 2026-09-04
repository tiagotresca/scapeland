#!/usr/bin/env bash
# Fetches the Scapeland brand assets from their sources (Google Drive /
# Higgsfield CDN), optimizes them for the web and places them under assets/.
# Run by .github/workflows/fetch-assets.yml (GitHub runners have the open
# egress this needs). Safe to re-run: existing outputs are overwritten.
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p assets/img assets/media .assets-tmp

fetch() { # $1 url  $2 out
  echo "fetching $2"
  curl -fsSL --retry 3 --retry-delay 5 --max-time 300 "$1" -o "$2"
}

drive() { # $1 file id  $2 out
  fetch "https://drive.usercontent.google.com/download?id=$1&export=download&confirm=t" "$2"
}

# img <src> <dest> <max-width> — resize, then apply the brand film grade
img() {
  convert "$1" -auto-orient -resize "${3}x>" -strip -interlace Plane -quality 92 "$2"
  python3 scripts/grade.py "$2" > /dev/null
  echo "wrote $2 ($(du -h "$2" | cut -f1))"
}

# ————— sources (see assets/SOURCES.md) —————
source scripts/asset-manifest.sh

rm -rf .assets-tmp
echo "done"
