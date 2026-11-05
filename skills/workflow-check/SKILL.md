---
name: workflow-check
description: Zeigt, ob der zentrale Workflow (Mox2k/claude-workflow) in dieser Session geladen ist und welcher Stand. Nutzen, wenn der User /workflow-check aufruft oder fragt, ob der Workflow aktuell ist.
---

# /workflow-check

Melde in einer Zeile: Workflow geladen, Stand = Ausgabe von
`git -C ~/.claude/claude-workflow log -1 --format="%h %cd" --date=short`.
Bei Fehler: den Inhalt von `~/.claude/claude-workflow-sync.log` zeigen.
