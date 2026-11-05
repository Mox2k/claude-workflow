# Sonderfälle der Auswahl

## Feature-Ordner (`specs/<feature>/master.md` + `NN-<bereich>.md`)

Ein Feature-Ordner ist eine Einheit und wird als Ganzes beansprucht (Bus-Eintrag nach dem Ordner): die Sub-Specs teilen Architektur und Dateien, zwei Sessions darin würden zuverlässig kollidieren.

- Scope fragen (ganz / einzelne Sub-Specs), außer das Argument nennt ihn (`/implement feature 01,02` oder `alle`). Ungültiger Präfix oder Sub-Spec mit `status: in-progress` → melden und normal fragen, nie teilweise anwenden. Der Scope steht im Bus-Feld `scope:`, damit andere sehen, was dieser Lauf nicht abdeckt.
- Schritte 3–8 laufen je Sub-Spec in der gewählten Reihenfolge, jede grüne Sub-Spec wird einzeln integriert. Wird eine Sub-Spec rot, endet der Lauf nach ihr – sie war Grundlage der folgenden. Schritt 9 läuft einmal für das Feature.
- Pläne: `plans/<feature>/master-plan.md`, `plans/<feature>/NN-<bereich>-plan.md`. Vorhandene Pläne nicht überschreiben, fehlende nachplanen.
- Statuszeile mit Ebene `Sub-Spec N/M`.

## Plan statt Spec gewählt

Claim nur Bus + Worktree; der Plan bleibt bis Schritt 6 in `plans/`. Schritt 3 nur Einstufung (Pflichtfelder fehlen → aus dem Task-Text ergänzen). Schritt 4 entfällt. Der Review prüft allein gegen den Plan. `archive/done/` enthält dann nur den Plan.

## Prüflauf: Branch ist schon gebaut

Für Code, der woanders entstand (Cloud-Session, anderer Rechner, abgebrochener Lauf): Branch `cloud/<x>` o. ä., Spec und Plan liegen oft schon in `archive/` oder `archive/done/`.

- Claim wie üblich, Worktree auf einem Branch `pruef/<spec>` vom fertigen Branch statt von `main`.
- Schritte 1–6 entfallen. Weiter mit `git merge main` (Konflikte wie in `integration.md`), dann Schritt 7.
- **Lief schon ein Review** (Commit oder Übergabe nennt ihn): kein zweiter voller Review. Verifikation lokal vollständig ausführen (die Cloud hat oft andere Werkzeuge); der Reviewer bekommt nur die Merge-Konfliktstellen, den Diff seit dem dort geprüften Stand und die Abnahme-Referenzen. Lief keiner: normaler Final-Review.
- Weiter mit Schritt 8.

## Angebrochener Lauf

Mit Git erkennt Schritt 0 ihn am verwaisten Bus-Eintrag (`bus.md`, Fortsetzen). Liegt trotzdem etwas in `specs/in-progress/` ohne aktiven Bus-Eintrag: fragen, ob fortsetzen (Plan da → ab Schritt 4, sonst ab 3) oder zurück in die Queue.
