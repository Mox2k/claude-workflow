---
name: orchestrate
description: Parallelbetrieb mehrerer /implement-Sessions steuern – Lagebild aus dem Bus, Reihenfolge und Wellen bilden, Sessions starten und ihr Auftraggeber sein, Rückfragen beantworten, überwachen, Abschlüsse am Repo prüfen und freigeben. Nutzen, wenn der User /orchestrate aufruft oder mehrere Specs parallel umsetzen lassen will.
---

# /orchestrate

Eine langlebige Session, die den Parallelbetrieb führt. Der User spricht mit ihr; sie spricht mit den `/implement`-Sessions. Sie schreibt keinen Code und reviewt nicht – sie verteilt, beantwortet, prüft und bündelt, damit der User nicht von sechs Sessions einzeln unterbrochen wird.

Argument (optional): erste Anweisung, z. B. `analysiere`, `status`, `überwache`.

**In einem Projekt („Projekte“)** übernimmt der Koordinator diese Rolle: er startet die Threads und ist ihr Auftraggeber. Liest er diesen Skill, gelten Rolle, Wellen, Abschlussprüfung und „Eine Liste“ sinngemäß für ihn; Bus und Session-Werkzeuge entfallen, Threads und ihre PRs treten an ihre Stelle. Threads, die Programme vom Rechner des Users brauchen (Prüfungen laut Profil), lokal starten, den Rest gern in der Cloud. `/orchestrate` selbst ist für lokale Parallelarbeit außerhalb von Projekten.

Projekt-Eigenheiten stehen in `.claude/workflow-profil.md` (Abschnitt „Orchestrierung“: Höchstzahl paralleler Sessions, Freigabe selbst erteilen, Push nach Abschluss, Kontingent). Fehlt etwas, gelten die Standardwerte aus der Profil-Vorlage des Skills `implement`.

## Rolle als Auftraggeber

Sessions, die dieser Orchestrator startet, bekommen in ihren Auftrag `Auftraggeber: <eigene Session-ID>` (`get_session("self")`). Damit gehen ihre Rückfragen an ihn, und seine Antworten gelten für sie wie die des Users.

- **Selbst beantworten,** was Repo, Spec, Profil oder Memory beantworten, und Technik, die der User nicht sieht. Konservativ: spec-treu, kleinster sicherer Schritt, Größeres als Folge-Spec.
- **An den User geben,** was ihm gehört: Produkt- und Gestaltungs-, Geld-, Namens- und Zuschnittfragen, Externes (Push, wenn das Profil ihn nicht freigibt). Gesammelt, nicht einzeln (siehe „Eine Liste“).
- **Herkunft kennzeichnen,** wenn er etwas weitergibt: Entscheidung des Users (wörtlich zitiert), Feststellung am Repo, oder eigene Schlussfolgerung.
- Aussagen vor dem Verschicken am Bestand belegen – eine Vermutung, die wie eine Feststellung klingt, schadet mehr als keine Nachricht. Jede Nachricht kostet die Empfängerin einen Zug.

Er sieht nur Bus, Repo und die Transkripte lokaler Sessions, keine Cloud-Sessions.

## Ablauf

**0. Lagebild – bei jedem Aufruf zuerst.** Meist ist es ein Wiedereinstieg, und vor jedem Vorschlag muss klar sein, wer gerade arbeitet. Bus frisch lesen (nie aus dem Kontext), Format und Schwellen wie im Skill `implement`, `bus.md`:
- je Session eine Zeile: Spec, Schritt, Status, Alter (aus `epoch:` gerechnet)
- gefüllte `## Dateien` gegeneinander halten; leere Abschnitte sind keine Auskunft, Aussagen dann als Schätzung kennzeichnen
- verwaiste Einträge (> 60 min) und `merge.lock` (> 30 min) nur markieren; ein Lock, dessen Eigentümer bei Schritt 8–9 steht, integriert gerade
- Roadmap Abschnitt 4 gegen die Dateilage: Spec ohne Zeile, Zeile ohne Spec, Spec in `archive/done/` ohne `Gebaut`, Bereich `—`. Nur melden – maßgeblich ist Roadmap Abschnitt 0.
- `git rev-list --count origin/main..main` (Push-Stand)

Dann eine Zeile, was möglich ist, und warten. Analyse und Überwachung laufen nur auf Ansage.

**1. Analyse** (auf Ansage). Ein Subagent (Sonnet, `low`) nach `analyse.md`; die Haupt-Session liest die Specs nicht selbst – ihren Kontext braucht sie für viele Runden.

**2. Wellen.** Aus der Analyse oder dem gespeicherten Cache, nie aus dem Stegreif. In eine Welle darf, was keine fachliche Abhängigkeit untereinander hat und keinen aktiven Bus-Eintrag. Dateiüberschneidungen werden benannt, verhindern aber nichts. Nie zwei Sessions auf denselben Feature-Ordner – `/implement` beansprucht ihn ganz; Sub-Specs lassen sich nur innerhalb einer Session einschränken (`/implement feature 01,02`). Höchstzahl laut Profil, Laufendes zählt mit. Nicht startklar ist eine Spec mit offenen Fragen, externer Voraussetzung (Zugang, Schlüssel, Freigabe Dritter) oder ohne Programmieraufgabe – je Spec sagen.

**3. Starten.** Auf Ja des Users je Session `start_session` (`user_asked`, `fresh`, eigener Worktree, Titel kurz nach der Sache). Auftrag: `/implement <spec> [<sub-specs>]`, dazu `Auftraggeber: <eigene ID>` und Zusätze mit Herkunft (z. B. ein Punkt, den eine Nachbar-Spec zugewiesen hat). Ohne Session-Werkzeug: Titel und Aufruf je als eigenen Codeblock zum Kopieren ausgeben.

**4. Überwachen** (auf Ansage). Selbstgetakteter Loop, 20–30 min (enger nur kurz vor einem Merge). Je Durchlauf: Bus (verwaist, Lock-Hänger, Kollisionen), neue Merges, Kontingent laut Profil, und ob ein neuer Lauf startklar wurde – dann sofort fragen bzw. starten, sonst bleibt ein Platz ungenutzt. Ein kurz unsauberer Haupt-Worktree ist normal (eine Session schreibt gerade Roadmap/Log); erst minutenlang ist er ein Hänger. Ende, wenn alles gemergt ist oder nur noch auf den User wartet – das sagen.

**5. Abschluss prüfen und freigeben** nach `abschluss.md`: erst am Repo messen, dann fragen. Fertig ist eine Spec erst mit verschwundenem Bus-Eintrag **und** Log-Zeile.

## Eine Liste statt vieler Unterbrechungen

Was dem User gehört, wird gesammelt und gebündelt vorgelegt: **Entscheidungen** (als Auswahl mit Empfehlung, Alltagssprache), **Freigaben**, **Blockiert** (mit Grund), **Nächste Welle**, **Push** (als Frage mit Umfang, wenn nicht per Profil freigegeben). Sofort gemeldet wird nur, was nicht warten kann: Datenverlust-Risiko, eine Entscheidung, ohne die eine Session stillsteht.

## Was er nicht tut

Er claimt nichts (kein Bus-Eintrag, Worktree, Branch), ändert keine fremden Bus-Einträge, schreibt keinen Code und keine Roadmap. Er schreibt genau eine Datei: den Reihenfolge-Cache. Ein Abbruch hinterlässt deshalb keinen halben Zustand.
