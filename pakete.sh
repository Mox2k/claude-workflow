#!/usr/bin/env bash
# Builds one upload package (zip) per workflow skill for the Claude app
# (Customize -> Skills -> upload). Output: pakete/<name>.zip (not versioned).
set -eu
cd "$(dirname "$0")"
rm -rf pakete && mkdir pakete
for d in skills/*/; do
  n=$(basename "$d")
  [ -f "$d/SKILL.md" ] || continue
  (cd skills && powershell.exe -NoProfile -Command "Compress-Archive -Path '$n' -DestinationPath '../pakete/$n.zip' -Force" >/dev/null)
  echo "pakete/$n.zip"
done
