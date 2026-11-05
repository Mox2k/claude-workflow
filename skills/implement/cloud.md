# Cloud-Thread

Ein Cloud-Thread (z. B. aus „Projekte“) läuft in einem Container mit eigenem Clone: kein gemeinsames `.git` mit anderen Threads, also kein Bus und kein Worktree, und keine Werkzeuge vom Rechner des Users (lokal installierte Programme, GPU, lokale MCP-Server). Erkennbar an `CLAUDE_CODE_REMOTE=true` oder daran, dass das Projekt nicht unter dem lokalen Projektpfad liegt. Der Container kann jederzeit weg sein: **was nicht gepusht ist, existiert nicht.**

Abweichungen vom Ablauf:

- **Schritt 0:** kein Bus. `git fetch origin --prune`; belegt ist eine Spec, wenn auf `origin` ein Branch `implement/<spec>` existiert oder ein offener PR davon ausgeht. Prüfen, welche Befehle aus dem Profil hier laufen (Abhängigkeiten, Werkzeuge); was nicht läuft, ist ab jetzt ein offener Punkt.
- **Schritt 2:** Branch `implement/<spec>` von `origin/main`, sofort `git push -u origin implement/<spec>`. Schlägt der Push fehl, weil der Branch existiert, hat ein anderer Thread gerade übernommen → zurück zur Auswahl. Keine Worktrees.
- **Schritt 3:** nach dem Plan committen, pushen und einen Draft-PR öffnen (Titel = Thema; Beschreibung: Spec, Scope, Stufe).
- **Schritt 5 und 8:** nach jeder Welle und jedem Fix-Zyklus pushen.
- **Schritt 7:** Prüfungen, die hier nicht laufen können (z. B. Tests, die lokale Programme oder eine GPU brauchen, Aufnahmen, Messungen), werden als **offen** geführt, nie als bestanden. Der Lauf kann trotzdem grün werden, wenn alles Lauffähige grün ist und der Review passt – die offenen Prüfungen stehen dann im PR.
- **Schritt 8:** kein Merge nach `main`. Stattdessen Spec und Plan im Branch nach `archive/done/` verschieben, Roadmap-Status im Branch setzen, `origin/main` hereinmergen, Verifikation erneut, pushen, PR auf „bereit“. Beschreibung: was umgesetzt, Verifikation, Review mit offenen Minors, **offene Prüfungen mit dem Befehl, der sie lokal ausführt**, Folge-Specs.
- **Schritt 9:** Bericht an den Auftraggeber mit PR-Link und offenen Prüfungen. Gemergt wird erst, nachdem ein lokaler Thread die offenen Prüfungen nachgeholt hat (dort als Prüflauf, `sonderfaelle.md`), oder wenn es keine gibt und der Auftraggeber den Merge anordnet.
