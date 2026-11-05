# Ohne Git-Repo

Kein Bus, kein Worktree, kein Parallelbetrieb, kein Rollback, keine Integration. Einmal sagen und im Log vermerken. Dann:

- Schritt 0 entfällt.
- Schritt 2: die Spec nach `specs/in-progress/` verschieben – das ist der einzige Marker eines laufenden Laufs.
- Schritt 5: alle Pakete nacheinander, ohne Commits.
- Schritt 8: bei Rot gibt es keinen Branch zum Stehenlassen – die Änderungen liegen im Arbeitsverzeichnis; der Bericht nennt alle geänderten Dateien.
- Schritt 9: Log und `docs/projekt.md` direkt schreiben, Zentrale wie üblich (`integration.md`), keine Freigabefrage.
