# claude-workflow

Allgemeiner Claude-Code-Workflow als Skills, gleich für alle Projekte: `/prime`, `/brainstorm`, `/orchestrate`, `/implement`, `/browser-test`, `/debugging`, `/security-check`, `/shutdown`, `/projekt-setup`, dazu `zentrale` (Lesen und Schreiben der Projektzentrale, wird von den anderen aufgerufen).

Dieses Repo ist die **Werkstatt**: hier werden die Skills geändert, mit Verlauf. **Benutzt** werden sie als Konto-Skills der Claude-App – nur so hat sie jede Session und jeder Thread eines Projekts, lokal wie in der Cloud.

- `skills/<name>/` – die Workflow-Skills. Nichts Projektspezifisches; projekt-eigene Skills gehören versioniert ins jeweilige Projekt-Repo, Projekt-Eigenheiten in dessen `.claude/workflow-profil.md`.
- `skills/projekt-setup/vorlagen/` – Vorlagen für `CLAUDE.md` und `docs/projekt.md` eines Projekts.
- `skills/zentrale/seite/` – die Seite der Projektzentrale (`index.html`, alles in einer Datei): eine Artifact-Seite für alle Projekte mit Vorhaben, Status, Meilensteinen, Abnahme und den Eingaben des Users. Die Daten liegen nur im Artifact, nicht hier. Nach Änderungen an der Seite neu veröffentlichen (Skill `zentrale`, „Seite ändern“).
- `pakete.sh` – baut je Skill ein Upload-Paket nach `pakete/<name>.zip`.

## Ändern und verteilen

1. Skill in `skills/` ändern, committen, pushen.
2. `bash pakete.sh`
3. In der Claude-App (jedes Konto) unter **Anpassungen → Skills** die geänderten Pakete hochladen bzw. ersetzen.

## Projekt einrichten

Im Projekt `/projekt-setup` aufrufen – für neue und für alte Projekte. Er legt das Projekt in der Projektzentrale an (bzw. übernimmt eine alte Roadmap dorthin), schreibt `docs/projekt.md` mit ausprobierten Befehlen, verschiebt die Ablage nach `docs/`, macht Cloud-Threads lauffähig, entfernt alte Workflow-Commands, versioniert Projekt-Skills und bringt CLAUDE.md, Profil und Memory auf den Workflow.
