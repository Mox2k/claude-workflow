# Leistungsmessung nach der Integration (Schritt 9)

Nur wenn das Profil `Leistungsmessung` mit Befehl, Budgets und Abweichungsgrenze nennt, und nur nach einem integrierten Lauf. Leistung kann jeder Code kosten, nicht nur Grafik-Code.

1. Ohne Auftraggeber fragen, ob gemessen wird (Empfehlung: messen). Mit Auftraggeber messen, außer er sagt anders.
2. Der Rechner muss ruhig sein, sonst ist die Messung wertlos. Wenn das Profil einen Lastweg nennt (z. B. ein Lock-Skript), über ihn messen; sonst CPU-Last und schwere Prozesse selbst prüfen und bei Last nachfragen.
3. Im eigenen Worktree messen (nach der Integration gleicher Stand wie `main`). Werte zeigen: gemessen · Budget · letzter Lauf.
4. Über der Grenze (Standard: über Budget oder > 10 % schlechter als der letzte Lauf): Last erneut prüfen und ggf. nachmessen. Bleibt es, ohne Rückfrage eine Folge-Spec `specs/followup/<YYYY-MM-DD>-<spec>-leistung.md` (`status: complete`: Messwerte beider Läufe, Budget, Last, betroffener Bereich, vermutete Ursache aus dem Diff, Ziel) auf `main` schreiben – mit Lock wie in `integration.md`.
