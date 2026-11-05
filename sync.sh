#!/usr/bin/env bash
# Installs the skills of this repository user-wide into ~/.claude/skills/<name>.
# Called by the SessionStart hook of each project after git pull.
# Only skills this script installed itself are replaced or removed; a skill of the
# same name that came from somewhere else is left alone and reported.
set -u
SRC="$(cd "$(dirname "$0")" && pwd)/skills"
DST="$HOME/.claude/skills"
LIST="$HOME/.claude/claude-workflow-installed.txt"
mkdir -p "$DST"
touch "$LIST"

neu=""
for d in "$SRC"/*/; do
  [ -f "$d/SKILL.md" ] || continue
  n=$(basename "$d")
  if [ -e "$DST/$n" ] && ! grep -qx "$n" "$LIST"; then
    echo "UEBERSPRUNGEN (fremder Skill gleichen Namens): $n"
    continue
  fi
  rm -rf "$DST/$n" && cp -r "$d" "$DST/$n"
  neu="$neu$n"$'\n'
done

# Remove skills that were installed earlier but no longer exist in the repository.
while read -r n; do
  [ -n "$n" ] || continue
  printf '%s' "$neu" | grep -qx "$n" || { rm -rf "$DST/$n"; echo "ENTFERNT: $n"; }
done < "$LIST"

printf '%s' "$neu" > "$LIST"
echo "Installiert: $(printf '%s' "$neu" | tr '\n' ' ')"
