# CLAUDE.md

## Projekt

*<Name>* – <ein Satz: was es ist, Stack>. Wo was liegt:

- `docs/projekt-roadmap.md` – Projektstruktur, Befehle (Build, Tests, Linter), Ziele, Status aller Vorhaben. Einzige Doku-Datei; ihr Abschnitt 0 regelt, wer was hineinschreibt.
- `.claude/workflow-profil.md` – was in diesem Projekt für den Workflow gilt: Prüfbefehle, Projektregeln für Code, Abnahme-Referenzen, Security, Rückfragen.
- <weitere wichtige Orte: Design, Doku, Entwürfe>

## Arbeitsweise

- **Erst lesen, dann ändern.** Annahmen über Dateien führen zu Fehlern, die erst Schritte später auffallen.
- **Nur das Gefragte.** Kein Umbau nebenbei; direkte Abhängigkeiten der Änderung dürfen mit. Fällt etwas anderes auf: sagen. Bewusste Vereinfachungen als `ponytail:`-Kommentar mit Grenze und Ausbaupfad markieren.
- **Fragen, wenn zwei Lesarten zu wirklich verschiedener Arbeit führen.** Routine und Technik, die der User nicht sieht, selbst entscheiden.
- **Freigaben.** Lokale, umkehrbare Arbeit im Auftrag einfach tun. Was nach außen wirkt oder nicht umkehrbar ist – Push, Force, Löschen fremder Arbeit, Nachrichten, DB-Drops, Migrationen auf geteilten Systemen – nur mit Freigabe. Freigeben kann der User oder der Orchestrator, der eine Session gestartet hat (`Auftraggeber:` im Startauftrag): seine Anweisung gilt wie die des Users.
- **Bestehender Stil** von Code und Dateien gibt die Form vor.
- **Prüfen vor Fertigmelden.** Tests, Build oder Ansicht tatsächlich laufen lassen; ohne Nachweis gilt nichts als fertig.
- Zu Beginn jeder Session die Skills `caveman` und `ponytail` in Stufe `full` laden: knapp im Chat (Dateien, Code, Commits bleiben normale Prosa), einfachste funktionierende Lösung im Code. Vorgeschriebene Tests bleiben trotzdem Pflicht.

## Workflow

Die Workflow-Skills (`/prime`, `/brainstorm`, `/orchestrate`, `/implement`, `/browser-test`, `/debugging`, `/security-check`, `/shutdown`, `/workflow-aktualisieren`) kommen aus dem zentralen Repo `Mox2k/claude-workflow`. Der SessionStart-Hook `.claude/hooks/workflow-sync.sh` holt bei jedem Start den neuesten Stand nach `~/.claude/skills/` – lokal und in Cloud-Sessions.

- Workflow ändern: im zentralen Repo, committen, pushen – gilt dann für alle Projekte. Die Kopien unter `~/.claude/skills/` werden beim nächsten Start überschrieben.
- Was nur für dieses Projekt gilt, gehört ins Profil, nicht in den Workflow.
- Projekt-eigene Skills liegen versioniert in `.claude/skills/` dieses Repos und bleiben hier.
