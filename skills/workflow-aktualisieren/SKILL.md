---
name: workflow-aktualisieren
description: Ein Projekt auf den zentralen Workflow (Mox2k/claude-workflow) bringen oder neu dafür einrichten – Start-Hook eintragen, alte Workflow-Commands entfernen, Projekt-Skills versionieren, CLAUDE.md auf kurze Orientierung bringen, Projektprofil anlegen, Projekt-Memory aufräumen, bei neuem Projekt Roadmap anlegen. Nutzen, wenn der User /workflow-aktualisieren aufruft, ein altes Projekt umstellen oder ein neues Projekt anlegen will.
---

# /workflow-aktualisieren

Bringt das aktuelle Projekt auf den Stand des zentralen Workflows. Läuft in alten und neuen Projekten gleich; was schon stimmt, wird übersprungen. Am Ende ein Commit, kein Push.

Erst den Stand erfassen und dem User als kurze Liste zeigen, was sich ändern wird; nach seinem Ja alles umsetzen. Fremde, uncommittete Änderungen im Projekt nie mit committen.

## 1. Start-Hook

`vorlagen/workflow-sync.sh` (dieser Skill-Ordner) nach `.claude/hooks/workflow-sync.sh` kopieren. In `.claude/settings.json` den Eintrag ergänzen – vorhandene Einstellungen behalten, nur mergen:

```json
"hooks": { "SessionStart": [ { "hooks": [ { "type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/workflow-sync.sh\"" } ] } ] }
```

Er holt bei jedem Session-Start den neuesten Workflow nach `~/.claude/skills/`, lokal und in Cloud-Sessions.

## 2. Alte Workflow-Commands entfernen

In `.claude/commands/` die Dateien löschen, die jetzt als Skill kommen: `prime`, `brainstorm`, `orchestrate`, `implement`, `browser-test`, `debugging`, `security-check`, `shutdown` (`.md`). Sonst gäbe es jeden Befehl doppelt, alt und neu. Andere, projekt-eigene Commands bleiben. Leerer Ordner → entfernen.

## 3. Projekt-Skills versionieren

Alles unter `.claude/skills/` gehört ins Projekt-Repo, damit Cloud-Sessions es haben. In `.gitignore` Einträge entfernen, die `.claude/skills/` ausschließen; `.agents/` bleibt ignoriert (per `npx skills` installierte Skills liegen dort und sind unter `.claude/skills/` verlinkt – Git speichert die Dateien über den Link). Nur bisher unversionierte Skill-Dateien hinzufügen, keine fremden Änderungen an versionierten. Vorher nach Schlüsseln und Tokens suchen; Treffer nicht committen, sondern nennen.

Workflow-Skills (siehe Schritt 2) gehören nicht ins Projekt – liegt eine Kopie davon in `.claude/skills/`, entfernen.

## 4. CLAUDE.md

Ziel: kurze Orientierung nach `vorlagen/CLAUDE.md` – worum es geht, wo was liegt, Grundsätze der Arbeitsweise, wie der Workflow kommt. Inhalt aus Roadmap Abschnitt 1–2 und der alten CLAUDE.md ableiten.

Alte Workflow-Abschnitte (verbindliche Regeln, Workflow-Dateien-Baum, „nie bearbeiten“, Commands-, Skills- und Setup-Tabellen, Parallel-Sessions-Erklärung) entfallen – das steht jetzt im Workflow. Projektwissen aus der alten Datei bleibt erhalten: in die neue CLAUDE.md, ins Profil oder in die Roadmap, je nachdem, wohin es gehört.

## 5. Projektprofil

Fehlt `.claude/workflow-profil.md`: nach `implement/profil-vorlage.md` anlegen. Ableiten, was sich belegen lässt (Art, Stack, Befehle bzw. Verweis auf die Roadmap, Abnahme-Referenzen wie Entwürfe), den Rest als Frage. Security: an, außer das Projekt hat erkennbar weder Netz noch Konten noch fremde Daten – dann fragen. Profil dem User zum Bestätigen zeigen.

## 6. Projekt-Memory aufräumen

Ordner: `~/.claude/projects/<projektpfad mit - statt :\/>/memory/`. Gilt für alle Konten auf diesem Rechner. Jede Datei einordnen:

| Art | Was passiert |
|---|---|
| Vorliebe, Arbeitsweise, Entscheidung des Users | bleibt; Typ `user` oder `feedback` setzen |
| Workflow-Regel, die jetzt im Workflow steht (Rückfragen, Freigaben, Aufräumen, Orchestrator) | löschen, oder als Profilwert übernehmen, wenn sie projektspezifisch ist |
| Projektwissen (Technik, Pipelines, Befehle, Gestaltungsregeln) | ins Profil, in die Roadmap oder die Doku des zuständigen Projekt-Skills; dann löschen |
| überholt oder durch Neueres widerlegt | löschen |
| widerspricht einer anderen Memory | auflösen: die neuere Aussage des Users gilt, im Zweifel fragen |

Die geplanten Löschungen und Verschiebungen vorher als eine Liste zeigen. `MEMORY.md` danach als reinen Index: eine Zeile je Datei, kurzer Haken, kein Inhalt.

## 7. Neues Projekt

Fehlt `docs/projekt-roadmap.md`: aus `vorlagen/roadmap.md` anlegen (mit Marker `ROADMAP_STATUS: UNBEARBEITET`), dazu `docs/superpowers/specs/`, `plans/`, `archive/done/` (je mit `.gitkeep`). Danach `/prime` empfehlen – er füllt die Roadmap im Dialog. Hat eine vorhandene Roadmap keinen Abschnitt 0 „Pflegeregeln“, ihn aus der Vorlage oben einfügen, sonst nichts an der Roadmap ändern.

Kein Git-Repo: anbieten, eins anzulegen (ohne Git kein Parallelbetrieb und kein Cloud-Zugriff).

## 8. Abschluss

Ein Commit mit allen Änderungen dieses Laufs. Bericht: was geändert, was übersprungen, was offen. Hinweis: Cloud-Sessions sehen Hook und Skills erst nach dem Push; pushen nur auf Wort des Users.
