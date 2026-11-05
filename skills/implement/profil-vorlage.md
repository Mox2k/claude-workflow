# Projektprofil: Vorlage und Standardwerte

Jedes Projekt kann `.claude/workflow-profil.md` anlegen. Fehlt ein Feld oder die ganze Datei, gilt der Standardwert hier. Das Profil beschreibt Tatsachen und Wünsche des Projekts, keine Workflow-Regeln – die stehen im Skill.

```markdown
# Workflow-Profil <Projekt>

## Art
<ein Satz: was das Projekt ist, z. B. Singleplayer-Spiel, Web-App mit Kundendaten, Python-CLI>

## Befehle
<Tests, Build, Linter – oder Verweis, z. B. „`docs/projekt.md`, Befehle“>

## Zentrale
URL: <Link der Projektzentrale>
Projekt: <kennung>

## Rechenlast
<wie schwere Läufe gestartet werden, z. B. über ein Lock-Skript; Standard: direkt>

## Projektregeln für Code-Agents
<was jeder Implementierer und Fixer wissen muss, je Punkt eine Zeile mit Grund>

## Abnahme-Referenzen
<je Art von Änderung die Referenz, gegen die der Review prüft, z. B. UI → Entwurfsdatei>

## Security
an | aus  (+ ein Satz warum)

## Rückfragen
Aufräumen: fragen | ohne Rückfrage
Merge bei unsauberem main-Worktree: fragen | ja
Spec-Widersprüche und Lösungswege: fragen | selbst entscheiden (im Bericht nennen)

## Leistungsmessung
aus | Befehl, Budgets, Abweichungsgrenze (oder Verweis)

## Orchestrierung
Höchstzahl paralleler Sessions: <Zahl>
Freigabe selbst erteilen: nein | ja (wenn die Repo-Prüfung passt)
Nach Abschluss: <z. B. „✓“ im Titel, main pushen, archivieren>
Kontingent: <z. B. nach 5-Stunden-Limit steuern, Ziel ~85–90 % beim Reset>
```

## Standardwerte

| Feld | Standard |
|---|---|
| Befehle | aus `docs/projekt.md`, Befehle; fehlt das, einmal aus dem Repo ermitteln (`package.json`, `Makefile`, `pyproject.toml`, `build.gradle` …), nutzen und dort eintragen. Nichts Ausführbares → im Bericht „ohne Verifikation“ |
| Zentrale | keine – nichts in die Zentrale schreiben, `/projekt-setup` empfehlen |
| Rechenlast | direkt ausführen |
| Projektregeln | keine |
| Abnahme-Referenzen | keine; Review prüft gegen Spec und Plan |
| Security | **an** |
| Aufräumen | fragen |
| Merge bei unsauberem main-Worktree | fragen |
| Spec-Widersprüche | fragen |
| Leistungsmessung | aus |
| Höchstzahl paralleler Sessions | 3 |
| Freigabe selbst erteilen | nein – Freigabe gehört dem User |
| Nach Abschluss | nichts automatisch; Push nur auf Zuruf |
| Kontingent | nicht steuern |

## Sicherheitsregeln (bei Security „an“ jedem Code-Agent mitgeben)

- Eingaben von außen (Nutzer, Netz, Dateien, Umgebung, andere Dienste) validieren, bevor sie verwendet werden.
- Datenbank-, Shell- und andere interpretierte Aufrufe parametrisiert, nie per String-Zusammenbau.
- Ausgaben kontextgerecht escapen (HTML, URL, SQL, Shell, JSON).
- Keine Secrets in Code, Logs oder Fehlermeldungen; Fehlermeldungen nach außen knapp.
- Rechte, Token-Laufzeiten, CORS so eng wie möglich; Autorisierung serverseitig bei jedem Zugriff.
- Auth, Sessions und Kryptografie nie selbst bauen – etablierte Bibliotheken mit Standardeinstellungen.
- Widerspricht eine Task diesen Regeln: `DONE_WITH_CONCERNS` mit Begründung.

Security-Fläche (für die Einstufung L): Auth, Sessions/Token, Zahlungen, Kryptografie, externe Eingaben, Netz-/API-Grenzen, personenbezogene Daten, Uploads, dynamische Queries.
