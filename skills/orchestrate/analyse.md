# Auftrag an den Analyse-Subagent

Lies alle Specs in `docs/superpowers/specs/` und `specs/followup/` sowie alle Pläne in `plans/` (nicht `in-progress/`, nicht `archive/`). Was schon gebaut ist, steht in `archive/done/` und `implement-log.md`. Ändere keine Datei außer dem Cache.

- Specs mit `status: in-progress` nie empfehlen (Brainstorming unfertig).
- Feature-Ordner auch je Sub-Spec bewerten: reif, oder wartet sie auf etwas außerhalb des Ordners?
- Startbereitschaft je Spec: offene Fragen, externe Voraussetzungen, Werte, die erst im Betrieb entstehen, oder gar keine Programmieraufgabe → nicht startklar, mit Grund.

Zwei Achsen getrennt halten:

| Achse | Bedeutung | Folge |
|---|---|---|
| fachliche Abhängigkeit | B setzt Schnittstelle, Datenmodell oder Komponente aus A voraus | hart: B nie in dieselbe oder frühere Welle als A |
| Dateiberührung | A und B fassen dieselben Dateien an | weich: parallel erlaubt, Datei und Merge-Risiko nennen |

Genauigkeit der Dateiachse angeben: Bus `## Dateien` oder Plan `files:` = Feststellung; nur aus dem Spec-Text = Schätzung. Eine Spec, die etwas Geteiltes umbaut (Testattrappe, gemeinsame Bibliothek, quelltextweiter Wächter), gesondert nennen und ihre Nutzer im Bestand zählen – ihre Reichweite ist größer als ihre Dateiliste.

Rückgabe: geordnete Liste, je Eintrag eine Zeile Begründung, und je Eintrag mit fehlender Voraussetzung eine ausdrückliche Zeile.

**Cache** nach `$(git rev-parse --git-common-dir)/implement-reihenfolge.md` (ohne Git `docs/superpowers/reihenfolge.md`): Empfehlung, Datum (gemessen), Herkunft `/orchestrate`, Liste der Spec-/Plan-Pfade, aus denen sie entstand. Er liegt außerhalb des Arbeitsbaums, damit er den Haupt-Worktree nicht unsauber macht. `/implement` zeigt ihn nur an.
