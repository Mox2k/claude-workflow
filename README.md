# claude-workflow

Allgemeiner Claude-Code-Workflow (Skills), gleich für alle Projekte.

- `skills/<name>/` — Workflow-Skills. Projekt-eigene Skills (z. B. `werft`) gehören **nicht** hierher, sondern ins jeweilige Projekt-Repo.
- `sync.sh` — installiert die Skills benutzerweit nach `~/.claude/skills/`.
- `projekt-hook/workflow-sync.sh` — Vorlage für den SessionStart-Hook, der in jedes Projekt unter `.claude/hooks/` kommt und bei jedem Session-Start (lokal und in der Cloud) den neuesten Stand holt.

Einbindung in ein Projekt, `.claude/settings.json`:

```json
"hooks": {
  "SessionStart": [
    { "hooks": [ { "type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/workflow-sync.sh\"" } ] }
  ]
}
```
