---
name: prime
description: Session-Start – Projekt und offenen Workflow-Stand erfassen (Projekt und Befehle, Vorhaben aus der Projektzentrale, Specs, Folge-Specs, laufende Sessions, letzte Läufe), Eingaben des Users aus der Zentrale abholen und kompakt zusammenfassen. Nutzen, wenn der User /prime aufruft oder wissen will, wo das Projekt steht.
---

# /prime

Ziel: in wenigen Zeilen wissen, worum es im Projekt geht und was offen ist – ohne den Kontext mit Dateien zu füllen, die diese Session vielleicht nie braucht.

## Lesen

- `docs/projekt.md`: Abschnitt „Projekt“ und aus „Projektstruktur“ nur die Befehlstabelle – der Rest wird gelesen, wenn eine Aufgabe ihn braucht.
- `.claude/workflow-profil.md`, falls vorhanden (nur zur Kenntnis; Abschnitt „Zentrale“ gibt URL und Kennung).
- Die Projektzentrale (Skill `zentrale`, „Lesen“): Vorhaben mit Status und `aktiv`, Meilensteine, offene Abnahme-Punkte, `vorschlag`.
- Dateilisten (Glob, Inhalte nicht lesen): `docs/specs/` mit `in-progress/` und `followup/`, `docs/plans/`, jüngster Report in `docs/security-reports/` und `docs/browser-test/runs/`.
- Die letzten 3 Zeilen von `docs/implement-log.md`.
- Mit Git: den Bus (`$(git rev-parse --git-common-dir)/implement-bus/`, Format im Skill `implement`, `bus.md`) und `git rev-list --count origin/main..main`.

Fehlt `docs/projekt.md`, der Abschnitt „Zentrale“ im Profil oder das Projekt in der Zentrale: `/projekt-setup` empfehlen und mit dem weitermachen, was da ist. `/prime` legt nichts an und schreibt weder `docs/projekt.md` noch Planung.

## Eingaben abholen

Gleich nach dem Lesen die Eingaben des Users verarbeiten – Skill `zentrale`, Abschnitt „Abholen“ (Urteile, Ideen, Zurückgeholtes). Was dort ein Gespräch braucht („Besprechen“) oder größer ist, steht in der Zusammenfassung als offen, statt die Session gleich damit zu füllen.

## Zusammenfassung

Eine Zeile je Punkt, leere Punkte weglassen:
1. Projekt und aktuelles Ziel (nächster Meilenstein) in einem Satz
2. Abgeholte Eingaben (je eine Zeile, was daraus wurde) und offene, die noch den User brauchen; `vorschlag` der Zentrale
3. Vorhaben mit `Spec fertig` (startklar) und mit `aktiv`; Specs in der Queue (Name, Status)
4. Folge-Specs in `specs/followup/` – immer nennen, auch `— keine`, damit nie unklar ist, ob dort etwas liegt
5. Laufende Sessions aus dem Bus (Spec, Schritt, Alter aus `epoch:`; > 60 min als möglicherweise verwaist, nichts löschen); `specs/in-progress/` ohne Bus-Eintrag als hängengeblieben; `aktiv` in der Zentrale ohne passende Session als möglicherweise veraltet
6. Pläne, letzte Läufe (eine Zeile Bilanz), jüngster Security-/Browser-Test-Befund
7. `main` X Commits vor `origin/main`
8. Link zur Zentrale
