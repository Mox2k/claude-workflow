#!/usr/bin/env bash
# Fetches the central workflow (Mox2k/claude-workflow) to ~/.claude/claude-workflow
# and installs its skills user-wide. A failure never blocks the session start.
D="$HOME/.claude/claude-workflow"
URL="https://github.com/Mox2k/claude-workflow.git"
{
  date
  if [ -d "$D/.git" ]; then
    git -C "$D" pull --ff-only -q
  else
    git clone -q --depth 1 "$URL" "$D"
  fi
  [ -f "$D/sync.sh" ] && bash "$D/sync.sh"
} > "$HOME/.claude/claude-workflow-sync.log" 2>&1 || true
exit 0
