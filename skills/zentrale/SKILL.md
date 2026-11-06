---
name: zentrale
description: Die Projektzentrale lesen und schreiben – die eine Artifact-Seite für alle Projekte mit Vorhaben, Status, Meilensteinen, Abnahme und den Eingaben des Users (Urteile, Reihenfolge, Ideen, Zurückgeholtes). Nutzen, wenn ein anderer Workflow-Skill die Zentrale nennt (Status setzen, Abnahme anlegen, Eingaben abholen, Projekt anlegen), wenn der User „hol die Urteile/Ideen aus der Projektzentrale ab“ sagt oder wissen will, was dort offen ist.
---

# Projektzentrale

Eine Artifact-Seite für alle Projekte des Users. Sie ersetzt den Planungsteil der früheren `docs/projekt-roadmap.md`: Vorhaben, Status, Bereiche, Meilensteine, offene Themen und die Abnahme leben nur hier. Im Repo bleiben Projekt, Struktur und Befehle (`docs/projekt.md`).

Wo sie liegt, steht im Profil des Projekts (`.claude/workflow-profil.md`, Abschnitt „Zentrale“): `URL` und `Projekt` (die Kennung, z. B. `xy`). Fehlt der Abschnitt: `/projekt-setup` empfehlen, nichts schreiben.

## Dateien der Seite

| Datei | Wer schreibt | Inhalt |
|---|---|---|
| `index.html` | nur bei Änderungen an der Seite selbst (Quelle: `seite/index.html` dieses Skills) | die ganze Seite in einer Datei – nachgeladene oder fremde Skripte lässt das Artifact nicht zu |
| `daten/projekte.json` | `/projekt-setup` | Liste `[{id, name, farbe}]` |
| `daten/<id>.json` | Claude (die Skills unten) | alles Geplante eines Projekts |
| `eingaben/<id>.json` | nur die Seite (der User) | Urteile, Reihenfolge, Ideen, Zurückgeholtes |

**Nie `eingaben/` schreiben.** Was abgeholt ist, vermerkt Claude in `daten/<id>.json` (`abgeholt`, `ideen_abgeholt`); die Seite blendet es dann aus.

## `daten/<id>.json`

```json
{"stand":"2026-11-05T22:10:00",
 "vorschlag":{"ab":"<abnahme-id>","warum":"…"},
 "bereiche":{"B1":"Technik"},
 "meilensteine":[{"id":"M1","name":"Prototyp"}],
 "vorhaben":[{"nr":"37","b":"B5","m":"M1","t":"Titel","kurz":"Stichwort","s":"Idee","groesse":"klein",
   "wartet":["36"],"art":"finding","quelle":"Browser-Test 2026-11-06, B-012","aktiv":{"art":"Implementierung","seit":"21:15"},"info":"1–2 Sätze","cmd":"/brainstorm …","spec":"docs/specs/…","fertig":"2026-11-04"}],
 "abnahme":[{"id":"xy-ab3","gruppe":"Sensor","t":"Titel","aus":"196","stufe":"ansehen",
   "schritte":[["tun","erwartet"]],"wartet":["xy-ab2"],"behoben":"…","selbst":"wie Claude es prüft","info":"1–2 Sätze"}],
 "themen":["offenes Thema als Satz"],
 "abgeholt":{"<abnahme-id>":"<zeit des abgeholten Urteils>","z:<nr>":"<zeit>"},
 "ideen_abgeholt":["idee-…"]}
```

- `s` genau einer von `Idee`, `Spec läuft`, `Spec fertig`, `Gebaut`. `fertig` (Datum) nur bei `Gebaut`.
- `cmd`: der fertige Aufruf zum Kopieren – `Idee`/`Spec läuft` → `/brainstorm …`, `Spec fertig` → `/implement <spec-pfad>`.
- `wartet`: Nummern (Vorhaben) bzw. Abnahme-IDs, die vorher fertig sein müssen. Die Seite graut solche Punkte aus.
- `groesse`: `klein` (eine Session) oder `groß`.
- `art` (optional): `folge` = Folge-Spec aus einem Lauf, `finding` = offener Befund aus Review, Browser-Test oder Security-Check. Ohne `art` ist es ein normales Vorhaben. Die Seite filtert danach (Alle / Ohne Findings / Nur Findings). `quelle`: woher, kurz (Lauf, Report-Datei, `B-NNN`).
- `aktiv`: nur während eine Session daran arbeitet (`Brainstorm` oder `Implementierung`, Uhrzeit); am Ende entfernen.
- `stufe`: `ansehen` → nach „Ändern“ `beheben` (mit `behoben`: was gerade passiert) → `nachpruefen` (mit `behoben`: was geändert wurde). „Passt“ → Punkt entfernen.
- `info` (Abnahme, optional): 1–2 Sätze Hintergrund, ggf. „Seite: /…“; aufgeklappt über den Schritten.
- `selbst`: Claude prüft den Punkt selbst (Test, Browser, Clip); er erscheint nicht beim User.
- Reihenfolge der Arrays = Vorschlag; die Seite sortiert nach `eingaben/<id>.json` → `reihenfolge`.

## Pflegeregeln

1. Status nur über `s`, genau die vier Werte. Jedes Vorhaben genau ein Eintrag; neue Nummer = höchste vorhandene + 1.
2. **Bereiche und Meilensteine legt nur der User an.** Passt keiner, `b` bzw. `m` weglassen und im Bericht sagen.
3. Überholtes ersetzen, nicht überlagern. Keine Lauf-Historie (die steht in `docs/implement-log.md`).
4. Nur die Felder der eigenen Operation ändern.
5. Findings nicht doppelt: gibt es zum selben Befund schon ein offenes Vorhaben (gleiche `quelle` bzw. gleicher Inhalt), dieses aktualisieren statt ein neues anzulegen.

| Wer | Wann | Was |
|---|---|---|
| `/projekt-setup` | einmal | Projekt in `projekte.json`, `daten/<id>.json` anlegen bzw. aus alter Roadmap übernehmen |
| `/brainstorm` | Start | Vorhaben auf `Spec läuft` (oder neu), `aktiv` setzen |
| `/brainstorm` | Ende | `Spec fertig`, `spec`, `cmd` = `/implement <pfad>`, `wartet`, `groesse`; `aktiv` weg. Abbruch: nur `aktiv` weg |
| `/implement` | Start | `aktiv` setzen |
| `/implement` | Folge-Spec geschrieben | neues Vorhaben `Spec fertig`, `art: folge`, `spec`, `cmd` = `/implement <pfad>`, `quelle` = Spec des Laufs, `info` = Befund in einem Satz |
| `/implement` | Minor bleibt offen (Fix zurückgenommen) | neues Vorhaben `Idee`, `art: finding`, `quelle`, `info`, `cmd` |
| `/implement` | Ende grün, gemergt | `Gebaut`, `fertig`, `spec` = Archivpfad, `cmd` weg; Abnahme-Punkte anlegen; `aktiv` weg. Rot: `aktiv` weg, `info` des Vorhabens um „Letzter Lauf rot: <offene Blocker/Major in Stichworten>, Branch `<branch>`“ ergänzen. Nur PR (Cloud): nur `aktiv` weg – `Gebaut` setzt erst der Lauf, der mergt |
| `/browser-test` | Ende | je Finding, das offen, `failed` oder `regressed` bleibt: Vorhaben `Idee`, `art: finding`, `quelle` = Report und `B-NNN`, `cmd` = `/debugging B-NNN` |
| `/security-check` | Ende | je Finding, das nicht im Lauf behoben wird: Vorhaben `Idee` (bzw. `Spec fertig`, wenn eine Spec dafür entsteht), `art: finding`, `quelle` = Report, `cmd` |
| `/debugging` | Fix nachgewiesen | passendes `finding` auf `Gebaut`, `fertig` |
| Abholen (unten) | Start jeder vom User gestarteten Session, `/prime`, Aufruf | Eingaben verarbeiten |
| `/orchestrate` | – | liest, meldet Abweichungen, schreibt nichts |

## Lesen

`Artifact` `read` mit `url` und `paths: ["daten/<id>.json", "eingaben/<id>.json"]`. Kleine Dateien kommen direkt im Ergebnis; `eingaben/` fehlt, solange der User nichts eingetragen hat. Das geht auch in Cloud-Threads und aus dem zweiten Konto (getestet), sofern die Seite dort mit Schreibrecht geteilt ist.

## Schreiben

1. `read` mit `paths: ["index.html", "daten/<id>.json"]` – legt lokale Kopien an (Pfad steht im Ergebnis).
2. Die lokale `daten/<id>.json` ändern (Datei bearbeiten, gültiges JSON, `stand` = jetzt).
3. `read` mit nur der `url` (zählt als gesehen; nötig, sonst wird der Publish abgelehnt).
4. `publish` mit `url`, `file_path` = lokale `index.html`, `files: {"daten/<id>.json": "<lokaler Pfad>"}`.
5. Abgelehnt, weil inzwischen jemand gespeichert hat: ab Schritt 1 wiederholen und die eigene Änderung auf den neuen Stand setzen. Nie den alten Stand erneut senden. Beim Abholen dabei überspringen, was eine andere Session inzwischen abgeholt hat (`abgeholt`, `ideen_abgeholt`).

Mehrere Änderungen einer Session in einem Publish bündeln.

## Abholen

**Wann:** zu Beginn jeder Session, die der User selbst startet – die CLAUDE.md des Projekts verlangt es –, außerdem in `/prime` und auf den Aufruf „Hole die Urteile und Ideen aus der Projektzentrale ab …“. Nicht in Sessions mit `Auftraggeber:` im Startauftrag (vom Orchestrator gestartet): sonst holen mehrere parallele Sessions dasselbe ab.

**Beim Sessionstart** knapp halten, die eigentliche Anfrage des Users hat Vorrang: lesen; Buchhaltung (Passt, Idee, Zurückgeholt) gleich still verarbeiten; Ändern und Besprechen nur in einer Zeile nennen und fragen, ob sie jetzt drankommen. Nichts offen → kein Wort dazu. Auf den ausdrücklichen Aufruf und in `/prime` alles wie unten.


1. Lesen. Offen ist ein Urteil, wenn `abgeholt[<id>]` fehlt oder älter als `urteile[<id>].zeit` ist; eine Idee, wenn ihre `id` nicht in `ideen_abgeholt` steht; ein Zurückgeholtes (`zurueck[<nr>]`), wenn `abgeholt["z:<nr>"]` fehlt oder älter ist.
2. Je Eintrag:
   - **Passt** → Abnahme-Punkt entfernen.
   - **Ändern** → klein: sofort beheben (eigene Session oder Subagent laut Profil), Punkt auf `beheben`, danach `nachpruefen` mit `behoben`. Groß: neues Vorhaben (`Idee`, Notiz als `info`), Punkt `wartet` darauf.
   - **Besprechen** → im Chat mit dem User klären, dann wie Passt oder Ändern.
   - **Idee** → neues Vorhaben `Idee` mit nächster Nummer; Bereich und Meilenstein vorschlagen (nur vorhandene), `cmd` setzen.
   - **Zurückgeholt** → neuer Abnahme-Punkt zum Vorhaben `<nr>` mit Prüfschritten.
3. Alles Verarbeitete in `abgeholt` (mit der Zeit des Eintrags) bzw. `ideen_abgeholt` vermerken, `vorschlag` neu setzen, schreiben.
4. Bericht: je Eintrag eine Zeile, was daraus wurde.

## Abnahme-Punkte anlegen

Nach grünem `/implement`: für alles, was der User sehen oder ausprobieren muss, je ein Punkt. `id` = `<projekt>-ab<n>`, `gruppe` nach Ablauf (z. B. „Angebote“: erst Liste, dann Detailseite – Detailseite `wartet` auf Liste), `aus` = Vorhaben-Nummer, `schritte` als Paare „tun → erwartet“, konkret und kurz. Was Claude selbst prüfen kann (Tests, Browser-Test, Clip), als `selbst` mit einem Halbsatz, wie.

`vorschlag`: der eine Punkt, den der User als Nächstes ansehen sollte, mit `warum` (ein Satz).

## Neues Projekt

`/projekt-setup` erledigt es: Kennung (2–4 Kleinbuchstaben), Farbe (gedämpft, unterscheidbar von den anderen), Eintrag in `projekte.json`, `daten/<id>.json` aus der alten Roadmap oder leer; im Profil Abschnitt „Zentrale“. Beides in einem Publish (`files` mit beiden Dateien).

## Seite ändern

Quelle ist `seite/index.html` dieses Skills (CSS und Skript stehen darin). Nach Änderungen die Datei ins Arbeits- oder Scratchpad-Verzeichnis kopieren und als `file_path` veröffentlichen; `daten/` und `eingaben/` nie mitschicken.
