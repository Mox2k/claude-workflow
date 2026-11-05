# claude-workflow

Allgemeiner Claude-Code-Workflow als Skills, gleich für alle Projekte: `/prime`, `/brainstorm`, `/orchestrate`, `/implement`, `/browser-test`, `/debugging`, `/security-check`, `/shutdown`, `/workflow-aktualisieren`.

- `skills/<name>/` – die Workflow-Skills. Projekt-eigene Skills (z. B. `werft`) gehören **nicht** hierher, sondern versioniert ins jeweilige Projekt-Repo.
- `sync.sh` – installiert die Skills benutzerweit nach `~/.claude/skills/`.
- `skills/workflow-aktualisieren/vorlagen/` – Start-Hook, CLAUDE.md- und Roadmap-Vorlage für Projekte.

## Einrichten

**Neuer Rechner** (einmal, in Git Bash):

```bash
git clone https://github.com/Mox2k/claude-workflow.git ~/.claude/claude-workflow && bash ~/.claude/claude-workflow/sync.sh
```

**Projekt** (neu oder alt): im Projekt `/workflow-aktualisieren` aufrufen. Er trägt den SessionStart-Hook ein, der bei jedem Session-Start – lokal und in der Cloud – den neuesten Stand holt, und bringt CLAUDE.md, Profil und Memory auf den Workflow.

**Workflow ändern:** hier committen und pushen; jedes Projekt holt es beim nächsten Session-Start.
