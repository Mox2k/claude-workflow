# Bus: parallele Sessions

Mehrere Sessions dürfen gleichzeitig je eine Spec umsetzen, jede im eigenen Worktree. Damit sie voneinander wissen, teilen sie sich einen Bus im gemeinsamen Git-Verzeichnis:

```bash
BUS="$(git rev-parse --git-common-dir)/implement-bus"
```

Dort sieht ihn jeder Worktree, er wird nie committet und gerät in keinen Merge. Inhalt: eine Datei `<spec>.md` je laufender Session, und `merge.lock/` nur während einer Integration. Historie gehört nicht hierher – die steht in `git log main` und `implement-log.md`.

## Eintrag

```markdown
---
spec: user-auth
branch: implement/user-auth
worktree: ../projekt-wt/user-auth
status: claimed | running | waiting-for-merge | offen | pausiert
schritt: 5 von 9 — Umsetzung
aktualisiert: 2026-08-25T14:32:07+0200
epoch: 1787660327
scope: 01, 02          # nur Feature-Ordner: gewählte Sub-Specs
subspec: 2 von 3 — …   # nur Feature-Ordner
---

## Dateien
src/auth/**, src/api/session.ts

## Hinweise
- `createSession()` hat einen Parameter `ttl` bekommen.
```

- **Anlegen** exklusiv, damit zwei gleichzeitig startende Sessions nicht beide claimen: `set -o noclobber; > "$BUS/<spec>.md"`. Schlägt es fehl, hat eine andere Session gerade geclaimt → zurück zur Auswahl.
- **Bei jedem Schrittwechsel** `schritt:`, `aktualisiert:` und `epoch:` frisch messen – das ist zugleich das Lebenszeichen.
- **`## Dateien`** in Schritt 5 um die `files:` aller Tasks ergänzen, nie ersetzen (bei Feature-Ordnern bleiben die Dateien früherer Sub-Specs relevant).
- **`## Hinweise`** ergänzen, sobald der Lauf etwas ändert, das andere trifft: Signaturen öffentlicher Funktionen, Migrationen, verschobene Dateien, neue Abhängigkeiten, Config-Schlüssel.
- Eine Session schreibt nur ihre eigene Datei.
- **Löschen** nur nach der Freigabe in Schritt 9. Ist das Verzeichnis danach leer, das Verzeichnis selbst löschen. „Kein Eintrag“ heißt dadurch „vom Auftraggeber abgeschlossen“ – darauf baut das Aufräumen.

## Andere Sessions anzeigen (Schritt 0)

Je Eintrag eine Zeile: Spec, Branch, Schritt, Alter. Alter immer aus `epoch:` rechnen: `echo $(( ( $(date +%s) - <epoch> ) / 60 ))` Minuten. Fehlt `epoch:`, ist das Alter unbekannt. Dazu `## Dateien` und `## Hinweise` der anderen ausgeben – deshalb ist der Bus mehr als ein Lock.

## Verwaist

Älter als 60 Minuten heißt: die Session ist vermutlich abgestürzt oder geschlossen. Nie selbst löschen – sie könnte noch leben. Dem Auftraggeber vorlegen:
- **Fortsetzen:** in `worktree:` wechseln und ab `schritt:` weitermachen; Schritte 1–2 entfallen.
- **Freigeben:** Eintrag löschen, Spec wieder wählbar. Branch und Worktree bleiben, das ausdrücklich sagen.
- **Liegen lassen.**

`merge.lock/` älter als 30 Minuten: Freigeben oder Liegen lassen.

Steht im Eintrag `status: pausiert` oder ein Hinweis auf eine Pause des Users, oder sind viele Einträge gleichzeitig alt (typisch nach einer Pause): nur gesammelt in einer Zeile nennen und nichts entscheiden lassen – das betrifft diesen Lauf nicht. Eine Session, die der User bewusst anhält, setzt `status: pausiert`.

## Aufräumen (Schritt 0)

Kandidat ist ein Branch `implement/*`, der **keinen Bus-Eintrag** hat und **vollständig in `main`** ist (`git branch --merged main`). Beides zählt: bei einem Feature-Ordner ist der Branch nach der ersten Sub-Spec schon in `main`, die Session arbeitet aber weiter – nur der fehlende Eintrag beweist, dass sie fertig ist. Ein verwaister Eintrag zählt als vorhanden.

Entfernen mit `git worktree remove <pfad>` (entfällt, wenn es keinen Worktree mehr gibt) und `git branch -d <branch>` (nie `-D`: das kleine `-d` verweigert, falls doch etwas nicht gemergt ist). Uncommittete Änderungen im Worktree → stehen lassen und nennen. Ob vorher gefragt wird, sagt das Profil (`Aufräumen`). Liegt im Worktree ungesichertes Abnahme-Material (Videos, Bilder), es vorher nennen.

Eine Session entfernt nie ihren eigenen Worktree – sie arbeitet darin.

## Reihenfolge-Empfehlung (Schritt 1)

`/orchestrate` schreibt sie nach `$(git rev-parse --git-common-dir)/implement-reihenfolge.md` mit der Liste der Spec-Pfade, aus der sie entstand. Nur anzeigen: Pfade der Queue per Glob holen und mit der Liste vergleichen. Gleich → anzeigen mit Datum. Abweichend → anzeigen, als möglicherweise veraltet markieren, Neues/Weggefallenes nennen. Fehlt sie → eine Zeile Hinweis auf `/orchestrate`.
