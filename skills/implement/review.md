# Final-Review und Fixes (Schritte 7–8)

Der Review ist die eigentliche Qualitätskontrolle und der teuerste Teil des Laufs. Deshalb bekommt der Reviewer gezielt Material statt das ganze Repo.

## Auftrag an den Reviewer

Ein frischer Subagent (`medium`). Er bekommt:
- archivierte Spec und Plan (bei einem Plan-Lauf nur den Plan – das sagen, damit er keine Spec sucht)
- den Gesamt-Diff des Branches gegen `main` und die Liste der berührten Dateien; andere Dateien liest er nur, wenn eine Stelle im Diff es verlangt
- das Verifikations-Log aus Schritt 7
- die `DONE_WITH_CONCERNS`-Bedenken der Implementierer
- die **Abnahme-Referenzen** aus dem Profil, die zu diesem Diff passen (z. B. UI-Entwurf, Ansichtenblatt, Artwork) – Abweichungen davon sind Findings, nicht Geschmack

Prüfachsen, in dieser Reihenfolge:
1. **Vollständigkeit** gegen den Plan (Vorlage `spec-reviewer-prompt.md` aus `subagent-driven-development`)
2. **Zusammenspiel** – passen die Teile an den Nahtstellen?
3. **Qualität** über den Gesamt-Diff (Vorlage `code-quality-reviewer-prompt.md`): Duplikate, inkonsistente Muster, schiefe Abstraktionen
4. **Abnahme** gegen die Referenzen
5. **Security** – nur wenn das Profil Security prüft

Gemeldet wird, was Verhalten, Wartbarkeit oder die Abnahme trifft. Reine Kosmetik (Kommentarwortlaut, Geschmack bei Namen, Formatierung, die der Linter nicht bemängelt) wird nicht gemeldet – sie kostet einen Fix-Agent und bringt nichts.

## Schweregrade

| | Was | Folge |
|---|---|---|
| **Blocker** | nicht umgesetzt, funktioniert nicht, Datenverlust möglich, Security-Lücke (falls geprüft) | rot |
| **Major** | teilweise umgesetzt, Fehlerfall unbehandelt, falsches Verhalten am Rand, sichtbare Abweichung von der Referenz | rot |
| **Minor** | kleine, verhaltensneutrale Mängel | im selben Lauf beheben |

## Rot: Fix-Zyklen

1. Je Finding ein Fix-Subagent; parallel nur bei getrennten Dateien. Auftrag: Finding im Wortlaut, Code-Ausschnitt, Dateigrenze, Projektregeln, nichts über das Finding hinaus ändern.
2. Rückmeldung `FIXED`, `NOT_FIXABLE` (bleibt offen, zählt gegen Grün) oder `NEEDS_DECISION` (Optionen an den Auftraggeber).
3. Verifikation erneut. Dann **Nachprüfung** statt neuem Review: ein Subagent (Sonnet, `low`) bekommt nur die Findings und den Fix-Diff und prüft, ob sie erledigt sind. Ein voller Review nur, wenn die Fixes mehr als ein Drittel der Dateien des Gesamt-Diffs berührt haben.
4. Obergrenze nach Stufe (S 2, M/L 3). Danach endet der Lauf rot: Spec und Plan bleiben in `archive/`, Branch und Worktree bleiben, der Bericht nennt alle offenen Findings.

## Grün: Minors

Alle Minors an einen Fix-Subagent (Sonnet, `low`), nur diese beheben. Danach Verifikation, **kein** neuer Review – ein Review über Kosmetik-Fixes findet neue Kosmetik, die Schleife bricht nur, wenn sie nicht beginnt. Scheitert der Fix oder wird die Verifikation rot: Fix-Commit zurücknehmen (`git revert`), Minor bleibt offen. Ein Minor macht den Lauf nie rot. Bleibt einer offen: als `finding` in die Zentrale (Skill `zentrale`, Tabelle „Wer/Wann/Was“).

## Folge-Spec

Nur für einen strukturellen Befund, der eine Entwurfsentscheidung braucht und nicht zu diesem Auftrag gehört (eine tragende Abstraktion sitzt falsch, ein Muster zieht sich durch fremden Code). Nach `specs/followup/<YYYY-MM-DD>-<spec>-strukturell.md`, `status: complete`. Die Zahl der Minors ist kein Grund für eine Spec. Jede Folge-Spec kommt als Vorhaben `art: folge` in die Zentrale (Schritt 9, im selben Publish).
