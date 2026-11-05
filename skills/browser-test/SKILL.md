---
name: browser-test
description: Web-Oberfläche im Browser testen und gefundene Fehler direkt beheben lassen – Feature-Katalog pflegen (docs/browser-test/), Features testen, Katalog gegen Code abgleichen, Bug-Hunt, nur Geändertes testen, alte Findings nachtesten. Nutzen, wenn der User /browser-test aufruft oder eine Web-App im Browser prüfen lassen will.
---

# /browser-test

Testet Features einer Web-Oberfläche so, wie ein Nutzer sie bedient, und prüft dabei auch, was im Hintergrund passieren muss (Netzwerk, Datenbank, sekundäre Seiten). Gefundene Fehler beheben Subagents gleich im selben Lauf.

Braucht einen Browser (eingebauter Browser oder Claude in Chrome). Ohne Browser: sagen und abbrechen.

## Dateien

- Katalog `docs/browser-test/scenarios.md`: Projektkopf (URLs, Start-Befehle, Login-Verweis – nie Zugangsdaten), Schweregrade `blocker`/`major`/`minor`/`cosmetic`, allgemeine Akzeptanz (keine Console-Errors, keine 5xx), je Feature ein Block `### F-NN — <Titel>` mit URL, Vorbedingung, Schritte, Akzeptanz (UI), Akzeptanz (Hintergrund), Bug wenn.
- Reports `docs/browser-test/runs/<YYYY-MM-DD>[-N|-hunt|-replay].md` – nur ungelöste Findings.

## Modus

Katalog fehlt → Bootstrap. Sonst nach Argument: `alle` / `F-NN,…` / Bereich / `"Freitext"` → Test; `scan` → Abgleich; `hunt` → Bug-Hunt; `diff` → nur vom Git-Diff betroffene Features; `replay [B-NNN|pfad]` → Findings des letzten Reports nachtesten. Leer → fragen. Ablauf je Modus in `modi.md`, Feature-Zuschnitt, Finding-Format und Fix-Auftrag in `bausteine.md`.

## Regeln eines Laufs

- Der Aufruf deckt Fix-Subagents, Re-Tests und die Start-Befehle aus dem Katalogkopf (Server-Neustart, Build, Cache leeren, Migration auf der lokalen Test-DB). Nie: Daten löschen außerhalb des Fixes, Reset, Force-Push.
- Findings werden im Lauf intern geführt (`B-NNN`, Status `open`/`fixed`/`failed`/`regressed`), behobene nie in eine Datei.
- Fixes parallel: je `blocker`/`major` ein Subagent (höchstens 5 gleichzeitig), alle `minor`/`cosmetic` gemeinsam an einen. Nur ein kleines Finding offen → die Haupt-Session behebt es selbst. Ein Blocker, der die Testfolge stoppt, wird sofort einzeln behoben.
- Nach jedem `fixed` das Feature erneut testen. Ein `failed` oder ein `regressed` beendet den Lauf.
- Report: bei `failed`/`regressed` immer (mit Verweis auf `/debugging B-NNN`), bei nur `open` fragen, sonst keiner. Inhalt nur Metadaten und Repro-Daten.

Bericht im Chat: getestet · gefunden · behoben · regressed · failed, bei Abbruch das auslösende Finding.
