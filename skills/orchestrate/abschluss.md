# Abschluss einer Session prüfen und freigeben

Eine Fertigmeldung wird am Repo geprüft, nicht geglaubt.

| Prüfung | Womit |
|---|---|
| Branch in `main` | `git rev-list --count main..<branch>` = 0 |
| Spec in `archive/done/` | Verzeichnis |
| Log-Zeile | Ende von `implement-log.md` |
| Roadmap-Zeile `Gebaut`, Spec-Pfad gültig | Abschnitt 4 |
| neue Folge-Spec | `specs/followup/` gegen den vorigen Stand |
| Reste im Worktree | `git status --porcelain`; nur Zeilenenden (`git diff --ignore-cr-at-eol` leer) sind kein Befund |
| Tests, Messläufe, Clips der Session fertig und gesichert | Bus, Rechenlast, Abnahme-Ordner |

Fertig = Bus-Eintrag weg **und** Log-Zeile da. Ein Eintrag verschwindet auch beim Freigeben eines verwaisten Eintrags – ohne Log-Zeile ist der Lauf beendet, aber nicht abgeschlossen; das nennen.

Was das Repo nicht beantwortet, bei der Session nachfragen: fehlt etwas im Bericht, wäre ein Browser-Test sinnvoll, wurde eine Beobachtung bewusst nicht notiert.

## Freigabe (Schritt 9 der Session)

Erlaubt das Profil `Freigabe selbst erteilen: ja` und passt alles oben: die Session anschreiben und freigeben. Bei offenen Entscheidungen, roten Tests, ungesicherten Clips oder einer Rückfrage der Session, die dem User gehört: den User fragen. Sonst (Standard) die Freigabe in die Liste für den User.

## Nach der Freigabe

Laut Profil (`Nach Abschluss`), in dieser Reihenfolge, sobald die Session ihren Bus-Eintrag gelöscht hat und nicht mehr arbeitet:
1. Titel mit „✓ “ voranstellen (`set_session_title`).
2. Push, wenn freigegeben: erst `origin/main` holen und mergen, falls GitHub voraus ist, dann `git push origin main`.
3. Session archivieren (nicht löschen – Archivieren lässt sich rückgängig machen).
4. Worktree und Branch aufräumen nach `implement/bus.md` „Aufräumen“ – vorher nach Clips darin sehen.

Nur für Sessions, die dieser Orchestrator gestartet hat; fremde nur auf Zuruf.
