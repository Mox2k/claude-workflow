# CLAUDE.md

## Projekt

*<Name>* – <ein Satz: was es ist, Stack>. Wo was liegt:

- `docs/projekt.md` – Projekt, Ziele, Projektstruktur und Befehle (Build, Tests, Linter; mit Spalte, was in der Cloud läuft).
- Projektzentrale – Vorhaben, Status, Meilensteine, Abnahme. Link und Projekt-Kennung im Profil, Abschnitt „Zentrale“; gelesen und geschrieben über den Skill `zentrale`.
- `docs/specs/`, `docs/plans/`, `docs/archive/done/` – Specs, Pläne, Erledigtes; Lauf-Log `docs/implement-log.md`.
- `.claude/workflow-profil.md` – was in diesem Projekt für den Workflow gilt: Prüfbefehle, Projektregeln für Code, Abnahme-Referenzen, Security, Rückfragen, Zentrale.
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

Die Workflow-Skills (`/prime`, `/brainstorm`, `/orchestrate`, `/implement`, `/browser-test`, `/debugging`, `/security-check`, `/shutdown`, `/projekt-setup`, dazu `zentrale`) sind Konto-Skills der Claude-App – so hat sie jede Session und jeder Thread, lokal und in der Cloud. Gepflegt werden sie im Repo `Mox2k/claude-workflow`; geändert wird dort, dann neu in die App hochgeladen.

- **Eingaben aus der Zentrale:** Zu Beginn jeder Session, die der User selbst startet (kein `Auftraggeber:` im Startauftrag), offene Eingaben in der Projektzentrale abholen – Skill `zentrale`, „Abholen“.
- Was nur für dieses Projekt gilt, gehört ins Profil, nicht in den Workflow.
- Projekt-eigene Skills liegen versioniert in `.claude/skills/` dieses Repos. Lokale Sessions laden sie selbst; **in einem Cloud-Thread fehlen sie** – dort bei Bedarf `.claude/skills/<name>/SKILL.md` lesen und befolgen.
- In einem Cloud-Thread laufen Programme vom Rechner des Users nicht; Prüfungen, die sie brauchen (Spalte „Läuft in der Cloud“ in `docs/projekt.md`, Profil), als offen melden, nicht als bestanden.

Das Profil gilt in jeder Session, nicht nur im Workflow: @.claude/workflow-profil.md
