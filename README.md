# claude-workflow

Allgemeiner Claude-Code-Workflow als Skills, gleich für alle Projekte: `/prime`, `/brainstorm`, `/orchestrate`, `/implement`, `/browser-test`, `/debugging`, `/security-check`, `/shutdown`, `/workflow-aktualisieren`.

Dieses Repo ist die **Werkstatt**: hier werden die Skills geändert, mit Verlauf. **Benutzt** werden sie als Konto-Skills der Claude-App – nur so hat sie jede Session und jeder Thread eines Projekts, lokal wie in der Cloud.

- `skills/<name>/` – die Workflow-Skills. Nichts Projektspezifisches; projekt-eigene Skills gehören versioniert ins jeweilige Projekt-Repo, Projekt-Eigenheiten in dessen `.claude/workflow-profil.md`.
- `skills/workflow-aktualisieren/vorlagen/` – CLAUDE.md- und Roadmap-Vorlage für Projekte.
- `pakete.sh` – baut je Skill ein Upload-Paket nach `pakete/<name>.zip`.

## Ändern und verteilen

1. Skill in `skills/` ändern, committen, pushen.
2. `bash pakete.sh`
3. In der Claude-App (jedes Konto) unter **Anpassungen → Skills** die geänderten Pakete hochladen bzw. ersetzen.

## Projekt einrichten

Im Projekt `/workflow-aktualisieren` aufrufen – für neue und für alte Projekte. Er entfernt alte Workflow-Commands, versioniert Projekt-Skills, bringt CLAUDE.md, Profil und Memory auf den Workflow und legt bei neuen Projekten die Roadmap an.
