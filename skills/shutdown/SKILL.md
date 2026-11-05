---
name: shutdown
description: Session sauber beenden – temporäre Dateien entfernen, Projektstruktur in der Roadmap nachziehen, committen, fertige implement-Branches und Worktrees aufräumen, Zusammenfassung. Nutzen, wenn der User /shutdown aufruft oder die Session abschließen will.
---

# /shutdown

## 1. Temporäres entfernen

Unversionierte Treffer für `**/.DS_Store`, `**/__pycache__/**`, `**/*.tmp`, `**/*.bak`, `**/*.log` auflisten und löschen. Nie in Fremd- und Build-Verzeichnissen (`node_modules/`, `venv/`, `.venv/`, `vendor/`, `dist/`, `build/`, `target/`, `.git/`), nie Dateien, die Git kennt (`git status --porcelain` gegenhalten), nichts außerhalb der Muster. Der Aufruf von `/shutdown` ist die Freigabe dafür.

## 2. Roadmap

Nur Abschnitt 2 „Projektstruktur“ nachziehen, wenn diese Session Struktur, Befehle oder Stack geändert hat – nach Abschnitt 0 der Roadmap. Status in Abschnitt 4 setzen `/brainstorm` und `/implement` in dem Moment, in dem er entsteht; eine falsche Zeile hier nur nennen.

## 3. Git

`git status`; Änderungen dieser Session stagen (keine Secrets, keine `.env`) und mit beschreibender Nachricht committen. Push nur, wenn der User es jetzt sagt oder das Profil es nach Abschluss vorsieht.

Fertige `implement/*`-Branches und Worktrees aufräumen wie im Skill `implement`, `bus.md` „Aufräumen“ (kein Bus-Eintrag **und** vollständig in `main`; nie `-D`; Rückfrage laut Profil). Bus-Einträge werden hier nie gelöscht – über das Ende einer Session entscheidet ihr Auftraggeber.

## 4. Zusammenfassung

Eine Zeile je Punkt, leere weglassen: aufgeräumt, geändert, noch offen im Repo (ungemergte Branches, laufende Sessions), Fragen an den User, was als Nächstes dran ist. Zum Schluss kurz im Stil von Yoda verabschieden.
