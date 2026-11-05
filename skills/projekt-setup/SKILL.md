---
name: projekt-setup
description: Ein Projekt einmalig für den zentralen Workflow (Mox2k/claude-workflow) einrichten oder ein altes darauf umstellen – Projekt in der Projektzentrale anlegen bzw. die alte Roadmap dorthin übernehmen, docs/projekt.md mit Struktur und Befehlen (ausprobiert, mit Cloud-Spalte), Ablage unter docs/, Cloud-Threads lauffähig machen, alte Workflow-Commands und Hooks entfernen, Projekt-Skills versionieren, CLAUDE.md und Profil nach Vorlage, Memory aufräumen. Nutzen, wenn der User /projekt-setup aufruft, ein neues Projekt anlegen oder ein altes umstellen will, ein Projekt in der Zentrale fehlt oder ein Repo noch alte Workflow-Commands, eine alte Roadmap oder eine alte Ablage hat.
---

# /projekt-setup

Bringt das aktuelle Projekt auf den Stand des zentralen Workflows, damit `/prime`, `/brainstorm`, `/implement` und `/orchestrate` darin ohne Rückfragen laufen und jeder Thread Tests ausführen kann. Läuft in alten und neuen Projekten gleich; erneut aufrufen ist gefahrlos – was schon stimmt, wird nur geprüft. Am Ende ein Commit, kein Push.

Erst den Stand erfassen (Schritte 1–3 lesen nur) und dem User als kurze Liste zeigen, was sich ändern wird; nach seinem Ja alles umsetzen. Fremde, uncommittete Änderungen im Projekt nie mit committen.

## Grundsätze

- **Bestand übernehmen, nicht ersetzen.** Vorhandene Roadmap, CLAUDE.md, Profil und Fachskills bleiben inhaltlich, wie sie sind; ergänzt wird, was fehlt, umgezogen, was jetzt woanders hingehört. Jede Änderung an Vorhandenem wird vorher gezeigt.
- **Nichts raten.** Was sich nicht aus dem Repo belegen lässt, wird gefragt oder bleibt als offene Frage im Bericht.
- **Eine Frage je Nachricht**, mit Empfehlung. Alle Fragen dieses Laufs kommen in einer zusammenhängenden Runde, nicht verstreut.

## 1. Bestand lesen

`CLAUDE.md`/`AGENTS.md`, `README`, `docs/` (alte Roadmap `docs/projekt-roadmap.md` oder der Pfad aus `CLAUDE.md`, `docs/projekt.md`, alte Ablage `docs/superpowers/`), `.claude/` (Commands, Skills, Settings, Hooks, Profil), Projekt-Memory (Schritt 11). Kein Git-Repo: anbieten, eins anzulegen – ohne Git kein Parallelbetrieb und kein Cloud-Zugriff.

## 2. Woher der Workflow kommt

Die Workflow-Skills sind Konto-Skills der Claude-App (nur die erreichen auch Cloud-Threads). Ins Projekt kommt davon nichts.
- Alter Start-Hook `workflow-sync.sh` in `.claude/settings.json` oder `.claude/hooks/`: entfernen, andere Einstellungen behalten.
- Fehlen Workflow-Skills (auch `zentrale`, `projekt-setup`) in der eigenen Skill-Liste: dem User sagen, dass er die Pakete aus `Mox2k/claude-workflow` (`pakete.sh`) in der App hochladen muss. Steht dort noch der alte Skill `workflow-aktualisieren`, soll er ihn löschen – dieser Skill ersetzt ihn.

## 3. Alte Workflow-Commands entfernen

In `.claude/commands/` und `.claude/skills/` alles mit dem Namen eines Workflow-Skills: `prime`, `brainstorm`, `orchestrate`, `implement`, `browser-test`, `debugging`, `security-check`, `shutdown`, `projekt-setup`, `zentrale`, `workflow-aktualisieren`, dazu ältere `create-plan`, `goal`. Sie überdecken die Konto-Skills; sonst gäbe es jeden Befehl doppelt. Auflisten, nach Ja löschen; leere Ordner entfernen. **Fachskills** (alles andere unter `.claude/skills/`) bleiben unangetastet.

Vorher projektspezifische Regeln aus den alten Commands heraussuchen, die nicht in die Workflow-Skills gehören (Messungen, Lastregeln, besondere Prüfskripte, zusätzliche Abschlusspflichten) – sie kommen ins Profil (Schritt 10), damit beim Löschen nichts verloren geht.

## 4. Projekt-Skills versionieren

Alles unter `.claude/skills/` gehört ins Projekt-Repo, damit Cloud-Sessions es haben. In `.gitignore` Einträge entfernen, die `.claude/skills/` ausschließen; `.agents/` bleibt ignoriert (per `npx skills` installierte Skills liegen dort und sind unter `.claude/skills/` verlinkt – Git speichert die Dateien über den Link). Nur bisher unversionierte Skill-Dateien hinzufügen, keine fremden Änderungen an versionierten. Vorher nach Schlüsseln und Tokens suchen; Treffer nicht committen, sondern nennen.

Cloud-Threads laden `.claude/skills/` nicht; dafür steht in der CLAUDE.md der Hinweis, die `SKILL.md` dort bei Bedarf selbst zu lesen.

## 5. Projekt und Zentrale

Geplantes (Vorhaben, Status, Bereiche, Meilensteine, offene Themen, Abnahme) lebt nur in der Projektzentrale; im Repo bleibt `docs/projekt.md` (Projekt, Projektstruktur, Befehle) nach `vorlagen/projekt.md`. In die Zentrale nur über den Skill `zentrale` schreiben („Schreiben“, „Neues Projekt“).

**Zentrale finden.** URL aus einem anderen Projektprofil (Abschnitt „Zentrale“), sonst `Artifact` `list` (Scope `all`) nach dem Titel „Projektzentrale“ durchsuchen, sonst den User fragen. Es gibt nur eine Zentrale für alle Projekte – nie eine zweite anlegen, solange eine erreichbar ist. Gibt es noch keine: die Seite aus `seite/` des Skills `zentrale` neu veröffentlichen (wie dort unter „Seite ändern“, ohne `url`) und die URL nennen. Steht das Projekt schon in `daten/projekte.json`: Kennung übernehmen, nichts neu anlegen, nur prüfen.

**Alte Roadmap vorhanden** (`docs/projekt-roadmap.md` ohne Marker `ROADMAP_STATUS: UNBEARBEITET`): übernehmen.
1. In die Zentrale: Bereiche (Abschnitt 3) → `bereiche` (Nummern behalten), Meilensteine (5) → `meilensteine`, ihre „Enthält“-Spalte → `m` der Vorhaben, Vorhaben (4) → `vorhaben` mit `nr`, `b`, `t`, `s`, `spec`, `cmd` nach Status (Skill `zentrale`), `fertig` nur, wenn das Datum belegbar ist (`docs/archive/done/<datum>-…`, Log). Offene Themen (6) → `themen`. Bereich `—` → `b` weglassen. Statuswerte außerhalb der vier, unklare Zuordnungen, Doppelzeilen: fragen, nicht raten. Nichts dazuerfinden (kein `groesse`, `wartet`, keine Abnahme-Punkte).
2. Die Übernahme vor dem Schreiben als Tabelle zeigen (Anzahl je Status, Auffälliges); nach Ja anlegen nach „Neues Projekt“ – `projekte.json` und `daten/<id>.json` in einem Publish. Danach lesen und gegen die Roadmap halten: gleiche Zahl Vorhaben, gleiche Status.
3. `git mv docs/projekt-roadmap.md docs/projekt.md` (Verlauf bleibt) und auf die Vorlage zurückbauen: Abschnitt 1 „Projekt“ und 2 „Projektstruktur“ bleiben inhaltlich, die Abschnitte 0 und 3–6 entfallen (stehen jetzt in der Zentrale). Befehlstabelle um die Spalte „Läuft in der Cloud“ ergänzen (Schritt 6).

**Kein Bestand** (oder Roadmap mit Marker `UNBEARBEITET`): Projekt-Fragen, eine je Runde:
1. Projektname und Kurzbeschreibung
2. Vision / übergeordnetes Ziel
3. Zwei bis drei Hauptziele
4. **Bereiche** – die fachlichen Teile des Projekts. Sie sind das Gerüst jedes Vorhabens, und kein Skill legt später einen an. Weiß der User sie noch nicht, bleiben sie leer; einmal sagen, nicht drängen.
5. Erste Meilensteine

1–3 nach `docs/projekt.md` (aus der Vorlage; eine unbearbeitete Roadmap per `git mv` dorthin), 4–5 in die Zentrale (`daten/<id>.json` sonst leer).

`docs/projekt.md` schon vorhanden: nur Schritt 6 prüfen; fehlt das Projekt in der Zentrale, es leer anlegen.

## 6. Projektstruktur und Befehle

1. Ist „Projektstruktur“ in `docs/projekt.md` gefüllt: Stichprobe, ob Verzeichnisse und Befehle noch stimmen. Abweichungen zeigen, nach Ja korrigieren.
2. Ist sie leer: selbst ermitteln und als Vorschlag zeigen – Stack über Repo-Marker (`package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `*.csproj`/`*.sln`, `build.gradle`, `Gemfile`, `composer.json`, `Makefile`), Befehle für Installieren, Testen, Build, Linter, Starten aus denselben Markern, Verzeichnisse oberster Ebene ohne Werkzeugpfade, Einstiegspunkte und Testverzeichnis.
3. **Jeden Befehl hier wirklich ausprobieren** (schwere Läufe über den Lastweg des Profils) und die Spalte „Läuft in der Cloud“ ehrlich füllen: `ja` / `nein: <Grund>` (GPU, Spiel-Engine, lokales Programm, lokale Datenbank, Zugangsdaten). Dieses Wissen braucht `/implement`, um nichts Unmögliches als bestanden zu melden. Was hier nicht lief, steht so im Bericht.
4. Leeres Repo: Abschnitt bleibt leer, einmal erwähnen.

## 7. Cloud-Threads lauffähig machen

Jeder Thread startet in einem frischen Container; damit Tests dort laufen, müssen Abhängigkeiten automatisch installiert werden.
1. Prüfen, ob schon ein Startmechanismus existiert (SessionStart-Hook in `.claude/settings.json`, Setup-Skript der Umgebung).
2. Fehlt er: einen SessionStart-Hook einrichten, der die Abhängigkeiten installiert (gibt es den Skill `session-start-hook`, ihn nutzen). Er darf nur installieren, nie Daten ändern oder deployen, läuft nur in der Cloud (`CLAUDE_CODE_REMOTE=true`) und ist schnell, wenn alles schon da ist.
3. Testen: Hook einmal ausführen, danach den Testbefehl. Ergebnis im Bericht.
4. Braucht der Test Dienste (Datenbank, Cache) oder Secrets, die der Container nicht hat: nennen, was in den Umgebungseinstellungen des Projekts fehlt. Nie selbst Zugangsdaten ins Repo schreiben.

## 8. Ablage

Ziel: `docs/specs/` (mit `in-progress/`, `followup/`), `docs/plans/`, `docs/archive/done/`, Log `docs/implement-log.md`. Fehlende Ordner mit je einer `.gitkeep` anlegen.

Liegt die Ablage noch unter `docs/superpowers/`: alles per `git mv` eine Ebene hoch nach `docs/` (Verlauf bleibt), dann den leeren Ordner entfernen. Verweise auf den alten Pfad anpassen (Suche über das Repo): in offenen Specs und Plänen, CLAUDE.md, Profil, `docs/projekt.md`, Projekt-Skills, Skripten. Das Archiv bleibt, wie es ist – es ist Historie. Läuft gerade eine Session (Bus `$(git rev-parse --git-common-dir)/implement-bus/` nicht leer oder `specs/in-progress/` belegt): nicht verschieben, sondern sagen und nach deren Ende neu aufrufen.

## 9. CLAUDE.md

Ziel: kurze Orientierung nach `vorlagen/CLAUDE.md` – worum es geht, wo was liegt, Grundsätze der Arbeitsweise, wie der Workflow kommt. Inhalt aus `docs/projekt.md` und der alten CLAUDE.md ableiten.

Alte Workflow-Abschnitte (verbindliche Regeln, Workflow-Dateien-Baum, „nie bearbeiten“, Commands-, Skills- und Setup-Tabellen, Parallel-Sessions-Erklärung, Verweise auf die Roadmap) entfallen – das steht jetzt im Workflow. Projektwissen aus der alten Datei bleibt erhalten: in die neue CLAUDE.md, ins Profil oder nach `docs/projekt.md`, je nachdem, wohin es gehört.

## 10. Projektprofil

Fehlt `.claude/workflow-profil.md`: nach `implement/profil-vorlage.md` anlegen. Ableiten, was sich belegen lässt (Art, Befehle als Verweis auf `docs/projekt.md`, Lastweg, Abnahme-Referenzen wie Entwürfe, Regeln aus Schritt 3, Prüfungen, die nur lokal laufen), den Rest als Frage. Security: an, außer das Projekt hat erkennbar weder Netz noch Konten noch fremde Daten – dann fragen.

Immer den Abschnitt **„Zentrale“** schreiben bzw. prüfen: `URL:` (Schritt 5), `Projekt:` (Kennung). Verweise des Profils auf die alte Roadmap auf `docs/projekt.md` umstellen. Profil dem User zum Bestätigen zeigen.

## 11. Projekt-Memory aufräumen

Ordner: `~/.claude/projects/<projektpfad mit - statt :\/>/memory/`. Gilt für alle Konten auf diesem Rechner. Jede Datei einordnen:

| Art | Was passiert |
|---|---|
| Vorliebe, Arbeitsweise, Entscheidung des Users | bleibt; Typ `user` oder `feedback` setzen |
| Workflow-Regel, die jetzt im Workflow steht (Rückfragen, Freigaben, Aufräumen, Orchestrator) | löschen, oder als Profilwert übernehmen, wenn sie projektspezifisch ist |
| Projektwissen (Technik, Pipelines, Befehle, Gestaltungsregeln) | ins Profil, nach `docs/projekt.md` oder in die Doku des zuständigen Projekt-Skills; dann löschen |
| Geplantes, offene Ideen | als Vorhaben `Idee` oder Thema in die Zentrale; dann löschen |
| Verweise auf alte Pfade (Roadmap, alte Ablage) | auf die neuen umschreiben |
| überholt oder durch Neueres widerlegt | löschen |
| widerspricht einer anderen Memory | auflösen: die neuere Aussage des Users gilt, im Zweifel fragen |

Die geplanten Löschungen und Verschiebungen vorher als eine Liste zeigen. `MEMORY.md` danach als reinen Index: eine Zeile je Datei, kurzer Haken, kein Inhalt. Memory liegt außerhalb des Repos und kommt in keinen Commit.

## 12. Abschluss

Ein Commit mit allen Änderungen dieses Laufs im Repo, kein Push, kein PR. Bericht, eine Zeile je Punkt, Leeres weglassen:
- Zentrale: angelegt / übernommen (Zahl der Vorhaben je Status) / schon vorhanden, Kennung, Link
- `docs/projekt.md`: neu / aus Roadmap umgebaut / geprüft
- Befehle mit Cloud-Status; Startmechanismus und Testergebnis
- Ablage verschoben, angepasste Verweise
- entfernte Commands und Hooks, versionierte Skills, CLAUDE.md- und Profil-Änderungen, Memory
- fehlende Umgebungseinstellungen, fehlende Konto-Skills, offene Fragen

Hinweis: Cloud-Threads sehen CLAUDE.md, Profil und Projekt-Skills erst nach dem Push; pushen nur auf Wort des Users. Danach geht es mit `/prime` oder `/brainstorm` weiter.
