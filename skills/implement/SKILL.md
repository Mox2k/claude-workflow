---
name: implement
description: Eine Spec komplett abarbeiten – Plan, Umsetzung durch Subagents, Verifikation, Review, Integration nach main, Abschluss. Nutzen, wenn der User /implement aufruft, eine Spec oder einen Plan umsetzen lassen will oder ein von /orchestrate gestarteter Auftrag eine Spec nennt. Auch für Prüfläufe über fertige Branches (z. B. aus der Cloud).
---

# /implement

Ein Aufruf setzt eine Spec um und bringt sie grün nach `main`. Die Haupt-Session plant, verteilt und entscheidet; Code schreiben und reviewen Subagents. So bleibt ihr Kontext für die Steuerung frei, und der Review sieht den Code mit frischen Augen.

Argument (optional): `<spec-oder-plan> [<sub-specs>]`, z. B. `dashboard 01,02`. Ohne Argument wird aus der Queue gewählt.

## Vor dem Start

**Profil lesen.** `.claude/workflow-profil.md` im Projekt beschreibt, was in diesem Projekt anders ist: Prüfbefehle, Projektregeln für Code-Agents, Abnahme-Referenzen, ob Security geprüft wird, wie viel gefragt wird. Fehlt die Datei, gelten die Standardwerte aus `profil-vorlage.md` (in diesem Skill-Ordner) – einmal sagen, dass ohne Profil gearbeitet wird.

**Auftraggeber klären.** Läuft die Session als Thread eines Projekts („Projekte“), ist der Koordinator des Projekts der Auftraggeber. Nennt der Startauftrag eine Orchestrator-Session (`Auftraggeber: local_…`), ist es diese. Die Anweisungen des Auftraggebers gelten wie die des Users, und jede Rückfrage dieses Laufs geht an ihn (als Thread: als Antwort an den Koordinator; sonst per `SendMessage`), nicht an den User. Der User spricht mit dem Auftraggeber; eine Antwort wie „dafür brauche ich die Freigabe des Users“ ist dann falsch. Ohne Auftraggeber wird der User direkt gefragt – Auswahlfragen per `AskUserQuestion`.

**Wo läuft die Session?** In einem Cloud-Thread gibt es keinen Bus, keinen Worktree und keine Programme vom Rechner des Users – dann gelten zusätzlich die Abweichungen aus `cloud.md`.

**Wann gefragt wird.** Nur, wo eine Antwort den Lauf wirklich ändert: Spec-Auswahl, ein Blocker, den Nachliefern nicht löst, eine Entscheidung zwischen Lösungswegen mit verschiedenen Folgen, und am Ende die Freigabe. Technik, die der User nicht sieht, entscheidet der Lauf selbst. Das Profil kann weitere Fragen abschalten (Aufräumen, Merge bei unsauberem main-Worktree).

**Skills.** Gebraucht werden `superpowers:writing-plans`, `superpowers:subagent-driven-development`, `superpowers:using-git-worktrees`, `superpowers:verification-before-completion`. Fehlt einer, das sagen und ohne ihn weiterarbeiten: Prompts und Pläne dann selbst nach den Inhalten unten schreiben, Worktree mit `git worktree add`. Im Log vermerken.

## Ablauf

Die Schritte heißen in Meldungen `Schritt N von 9`. Statuszeile, eine Zeile, nur bei Schrittwechsel, Wellenstart, Review-Ergebnis, Fix-Zyklus und Blockern:
`<spec> · Schritt 5/9 Umsetzung · Welle 2/3 · Task 7/12 — <was gerade passiert>`

**0. Lage.** Mit Git: Bus lesen und andere laufende Sessions kurz auflisten, verwaiste Einträge und aufräumbare Branches behandeln – alles in `bus.md`. Ohne Git: `ohne-git.md`.

**1. Spec wählen.** Queue: `docs/superpowers/specs/` (ohne `in-progress/`), `specs/followup/` (Folge-Specs aus früheren Läufen) und `docs/superpowers/plans/`. Nicht wählbar: Specs mit `status: in-progress` (Brainstorming unfertig) und alles mit aktivem Bus-Eintrag. Zeigen als drei Listen (Specs `1, 2…`, Follow-ups `F1…`, Pläne `P1…`) plus die Reihenfolge-Empfehlung von `/orchestrate`, falls vorhanden (`bus.md`). Feature-Ordner, Plan statt Spec und Prüflauf: `sonderfaelle.md`.

**2. Übernehmen.** In dieser Reihenfolge, weil jeder Schritt den vorigen braucht: Bus-Eintrag exklusiv anlegen (der Claim gegenüber anderen Sessions), Worktree `../<repo>-wt/<spec>` auf Branch `implement/<spec>` von `main`, dann die Spec im Worktree nach `specs/in-progress/` verschieben und committen. Ab jetzt nur noch im Worktree arbeiten – im Hauptverzeichnis würden sich parallele Sessions gegenseitig die Dateien verschieben. Jede Verschiebung und jeder Plan wird sofort committet, sonst blockiert er später den Merge.

**3. Planen.** Spec lesen, Stufe nennen (eine Zeile Begründung, der Auftraggeber kann überstimmen, warten ist nicht nötig):

| Stufe | Wann | Plan | Umsetzung | Review | Fix-Zyklen |
|---|---|---|---|---|---|
| S | ≤ 2 Teilaufgaben, ein Bereich | Haupt-Session schreibt kurze Task-Liste selbst | ein Implementierer | einer | 2 |
| M | 3–8 Teilaufgaben | Plan-Subagent (`writing-plans`) | Wellen, ≤ 3 parallel | einer | 3 |
| L | > 8, Feature-Ordner, Architektur, Migrationen; Security-Fläche nur wenn das Profil Security prüft | je Plan ein Plan-Subagent | Wellen, ≤ 5 parallel | einer | 3 |

Im Zweifel die höhere Stufe; nach dem Plan an die echte Task-Zahl anpassen und das sagen. Pflicht je Task: `files:` (angelegte/geänderte Dateien) und `depends-on:`. Fehlen sie, einmal zurück an den Plan-Subagent, danach selbst ergänzen. Plan nach `plans/<spec>-plan.md`, committen.

**4. Spec archivieren.** `specs/in-progress/` → `archive/`, committen. Ab hier zählt nur der Plan.

**5. Umsetzen.** `superpowers:subagent-driven-development` laden. Wellen bilden: Welle 1 = Tasks ohne Abhängigkeit, Welle N = Tasks, deren Abhängigkeiten in früheren Wellen liegen. Tasks einer Welle, die Dateien oder ein Modul teilen, bündeln in ein Paket – weniger, größere Pakete sind schneller, weil jeder Subagent Kontext neu aufbaut. Pakete, die sich danach noch eine Datei teilen oder Sammelziele anfassen (Lockfiles, Manifeste, zentrale Config, Migrationen, Index-Exporte, Routing, Übersetzungstabellen), laufen nacheinander. Eigene `files:`-Menge in den Bus und gegen fremde Einträge abgleichen; Überschneidungen nur melden, sie fallen beim Merge an.

Auftrag an einen Implementierer, vollständig, denn er sieht weder Plan noch diese Datei:
- voller Text seiner Tasks, wo sie im Ganzen sitzen, was davor fertig wurde
- `files:` als Arbeitsgrenze – braucht er eine andere Datei, meldet er `NEEDS_CONTEXT`
- testgetrieben arbeiten, Tests ausführen, ein Commit pro Paket
- die Projektregeln aus dem Profil wörtlich (und die Sicherheitsregeln aus `profil-vorlage.md`, wenn das Profil Security prüft)
- Rückmeldung genau einer von `DONE`, `DONE_WITH_CONCERNS` (Bedenken gehen in den Review), `NEEDS_CONTEXT` (nachliefern; beim dritten Mal wie Blocker), `BLOCKED`

Nach einem Paket läuft kein Review – der Final-Review über den Gesamt-Diff sieht dasselbe und mehr. Das weicht bewusst vom Skill ab (dort Review je Task, keine Parallelität); hier verhindern `files:` und `depends-on:` die Konflikte, die der Skill fürchtet. `BLOCKED`, das sich nicht durch Kontext lösen lässt: Auftraggeber fragen (nachplanen, überspringen, abbrechen). Wird die Spec größer als eingestuft, sofort hochstufen.

Modell und Aufwand: mechanische, voll beschriebene Tasks → Sonnet, `low`; alles andere `medium`. Höher nicht – die Laufzeit steigt stark, das Ergebnis kaum.

**6. Plan archivieren.** `plans/` → `archive/`, committen.

**7. Prüfen.** Erst die Befehle ausführen (`verification-before-completion`): Tests, Build, Linter aus dem Profil. Ohne grüne Verifikation wird kein Lauf grün. Dann der Final-Review – Auftrag, Prüfachsen, Schweregrade in `review.md`.

**8. Entscheiden.** Grün = Verifikation sauber und keine offenen Blocker/Major. Rot → Fix-Zyklen nach `review.md`, bis zur Obergrenze der Stufe; danach endet der Lauf rot, Branch und Worktree bleiben stehen. Grün → Spec + Plan nach `archive/done/<YYYY-MM-DD>-<spec>/`, Minors beheben (`review.md`), dann sofort nach `main` integrieren (`integration.md`). Gepusht wird nie.

**9. Abschluss.** Roadmap und Log auf `main` nachziehen (`integration.md`), Bericht, Leistungsmessung falls das Profil sie vorsieht (`leistung.md`), dann Freigabe einholen: „Session abschließen?“ – bei jedem Ausgang, auch rot. Ja → Bus-Eintrag löschen (`bus.md`). Nein → Eintrag bleibt `offen`; entstehen bei der Nacharbeit Commits, läuft die Integration erneut.

Bericht, Ergebnis zuerst, je Punkt eine Zeile: grün/rot, Stufe, was umgesetzt, Verifikation, Review (offene Minors), integriert ja/nein mit Konflikten, Branch + Worktree, `main` läuft lokal voraus (nicht gepusht), Roadmap-Änderung, wer sonst noch läuft.

## Zeiten

Jede Zeitangabe wird mit `date` gemessen, nie aus dem Kontext übernommen oder geschätzt – an den Zeitstempeln im Bus hängen die Schwellen für verwaiste Einträge. `date +"%Y-%m-%dT%H:%M:%S%z|%s"` liefert Zeit und Epoche in einem Aufruf.
