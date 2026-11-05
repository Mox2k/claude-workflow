---
name: debugging
description: Einen Fehler systematisch eingrenzen und mit dem kleinsten Fix beheben – erst Ursache, dann Fix, dann Nachweis. Nutzen, wenn der User /debugging aufruft oder einen Bug, Absturz, falsches Verhalten oder einen roten Test meldet, auch mit B-NNN aus einem Browser-Test-Report.
---

# /debugging

Grundlage ist `superpowers:systematic-debugging`: Ursache finden statt raten, eine Hypothese zur Zeit, Fix mit Test, der vorher rot und danach grün ist.

1. **Problem fassen.** Ohne Beschreibung fragen: Was passiert, was wurde erwartet, gibt es Meldung, Log, Screenshot? Bei `B-NNN` die Reproduktion aus dem jüngsten Report in `docs/browser-test/runs/` nehmen.
2. **Kontext.** Fehlermeldung vollständig lesen, betroffene Stellen, letzte Änderungen (`git log`, `git diff`). Prüfbefehle und Projektregeln aus `.claude/workflow-profil.md` (z. B. wie schwere Läufe gestartet werden).
3. **Eingrenzen und beheben.** Kleinster Fix für genau diesen Fehler. Was nebenbei auffällt, nennen statt anfassen. Melden, wenn die Ursache gefunden ist, eine Hypothese fällt und die Richtung wechselt, oder etwas vom User gebraucht wird.
4. **Bericht.** Ursache in einem Satz, dann Fix und Nachweis. Nach drei gescheiterten Fixes: aufhören und mit dem User über den Aufbau sprechen – dann ist meist die Struktur das Problem.
