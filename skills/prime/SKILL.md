---
name: prime
description: Session-Start – Projekt und offenen Workflow-Stand erfassen (Roadmap, Specs, Folge-Specs, laufende Sessions, letzte Läufe) und kompakt zusammenfassen; legt bei neuem Projekt Roadmap und Projektstruktur im Dialog an. Nutzen, wenn der User /prime aufruft oder wissen will, wo das Projekt steht.
---

# /prime

Ziel: in wenigen Zeilen wissen, worum es im Projekt geht und was offen ist – ohne den Kontext mit Dateien zu füllen, die diese Session vielleicht nie braucht.

## Lesen

- `docs/projekt-roadmap.md`: Abschnitte 0 (Pflegeregeln), 1 (Projekt), 3 (Ziele/Meilensteine) und die Statusspalte von Abschnitt 4. Abschnitt 2 „Projektstruktur“ nur die Befehlstabelle – der Rest wird gelesen, wenn eine Aufgabe ihn braucht.
- `.claude/workflow-profil.md`, falls vorhanden (nur zur Kenntnis).
- Dateilisten (Glob, Inhalte nicht lesen): `docs/superpowers/specs/` mit `in-progress/` und `followup/`, `docs/superpowers/plans/`, jüngster Report in `docs/security-reports/` und `docs/browser-test/runs/`.
- Die letzten 3 Zeilen von `docs/superpowers/implement-log.md`.
- Mit Git: den Bus (`$(git rev-parse --git-common-dir)/implement-bus/`, Format im Skill `implement`, `bus.md`) und `git rev-list --count origin/main..main`.

## Neues Projekt

Trägt die Roadmap den Marker `<!-- ROADMAP_STATUS: UNBEARBEITET -->`: im Dialog eine Frage je Runde – Name und Kurzbeschreibung, Vision, 2–3 Ziele, **Bereiche** (die fachlichen Teile; nur der Mensch legt sie an, ohne sie landet jedes Vorhaben unter `—`), erste Meilensteine. Eintragen, Marker und Hinweisblock entfernen, Abschnitt 0 stehen lassen.

Ist Abschnitt 2 leer: Struktur aus dem Repo ermitteln (Marker wie `package.json`, `pyproject.toml`, `*.csproj`, `build.gradle`, `go.mod`; Befehle daraus; Verzeichnisse oberster Ebene; Einstiegspunkte) und als Vorschlag zeigen. Nichts raten – was sich nicht belegen lässt, bleibt als offene Frage. Gibt es kein Profil, anbieten, eins aus der Vorlage (`implement/profil-vorlage.md`) anzulegen.

Nur in diesem Fall schreibt `/prime` die Roadmap; sonst schreiben nur `/brainstorm` und `/implement` hinein.

## Zusammenfassung

Eine Zeile je Punkt, leere Punkte weglassen:
1. Projekt und aktuelles Ziel in einem Satz
2. Specs in der Queue (Name, Status)
3. Folge-Specs in `specs/followup/` – immer nennen, auch `— keine`, damit nie unklar ist, ob dort etwas liegt
4. Laufende Sessions aus dem Bus (Spec, Schritt, Alter aus `epoch:`; > 60 min als möglicherweise verwaist, nichts löschen); `specs/in-progress/` ohne Bus-Eintrag als hängengeblieben
5. Pläne, letzte Läufe (eine Zeile Bilanz), jüngster Security-/Browser-Test-Befund
6. `main` X Commits vor `origin/main`
