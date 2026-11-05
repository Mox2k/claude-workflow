---
name: brainstorm
description: Eine Idee oder Anforderung im Dialog klären und als Spec festhalten (einzelne Spec oder Feature-Ordner mit Master und Sub-Specs), inklusive Vorhaben in der Projektzentrale. Nutzen, wenn der User /brainstorm aufruft, ein neues Feature durchdenken will oder eine Spec für /implement braucht.
---

# /brainstorm

Ergebnis ist eine Spec, die `/implement` ohne Rückfragen umsetzen kann: ein Protokoll der getroffenen Entscheidungen, kein Aufsatz. Grundlage ist der Skill `superpowers:brainstorming`.

## Start

1. **Thema klären**, falls keins genannt ist – erst danach den Modus.
2. **Laufende Brainstormings** suchen: Ordner in `docs/specs/` (nicht `in-progress/`, `followup/`) mit `master.md` und `status: in-progress`. Gibt es welche, anbieten, eins fortzusetzen.
3. **Modus**: *Normal* – eine Spec `specs/<name>.md`. *Gründlich* – Feature-Ordner `specs/<feature>/` mit `master.md` und Sub-Specs `NN-<bereich>.md`, Ast für Ast ausgefragt; für große Vorhaben, deren Teile einzeln umsetzbar sein sollen.
4. **Material**: passende Referenzen anbieten – Entwürfe, Artworks, bestehender Code, Dateien in `assets/`. Echtes Material schlägt Beschreibung.
5. **Zentrale** (Skill `zentrale`, nach dessen Pflegeregeln): passendes Vorhaben auf `Spec läuft` setzen, sonst neues anlegen (nächste Nummer, Bereich und Meilenstein nur aus den vorhandenen, sonst weglassen; nie einen erfinden), `aktiv` = `Brainstorm` mit Uhrzeit. Fehlt der Abschnitt „Zentrale“ im Profil: nichts schreiben, auf `/projekt-setup` verweisen, trotzdem weitermachen.

## Fragen

Was sich aus dem Code oder dem Material beantworten lässt, erst nachsehen, dann fragen. Fragen kurz und ohne Jargon, als Auswahl per `AskUserQuestion`, bis zu vier je Block, mit markierter Empfehlung und je Option einem Satz zur Folge. Ideenlisten (Namen, Varianten) lieber als Liste im Text. Projektregeln aus `.claude/workflow-profil.md` gelten auch für Specs (z. B. Greybox, keine neuen Tasten).

## Spec

Jede Sektion enthält, was entschieden wurde; leere Sektionen fallen weg. Frontmatter `status: in-progress`, bis der User die Spec bestätigt, dann `status: complete` – nur fertige Specs nimmt `/implement`.

Feature-Ordner: zuerst `master.md` (Ziel/Problem, Gesamt-Architektur, Schnittstellen/Datenmodell, Sub-Spec-Index, Risiken, Out-of-Scope, Glossar), dann je Sub-Spec Ziel, Detail-Design, Schnittstellen, Grenzfälle. Je Abschnitt bestätigen lassen und die nächste Sub-Spec vorschlagen; der User kann umlenken oder pausieren. Neu entdeckte Bereiche in den Index aufnehmen. Fertig, wenn alle Sub-Specs und der Master `complete` sind.

Danach in der Zentrale: `Spec fertig`, `spec` = Pfad, `cmd` = `/implement <pfad>`, `wartet` (Vorhaben, die vorher gebaut sein müssen), `groesse`, `aktiv` weg. Abgebrochen bleibt es `Spec läuft` – das zeigt das angefangene Brainstorming –, `aktiv` kommt trotzdem weg.

## Bericht

Ergebnis zuerst: Pfad der Spec (bzw. Ordner mit Sub-Specs und Status), Vorhaben in der Zentrale (Nummer, Bereich, Status, neu oder vorhanden; ohne Bereich ausdrücklich sagen), nächster Schritt `/implement`.
