---
name: security-check
description: Gezielter Security-Audit eines Projekts oder Bereichs mit Bericht unter docs/security-reports/. Nutzen, wenn der User /security-check aufruft oder ausdrücklich eine Sicherheitsprüfung will.
---

# /security-check

Steht in `.claude/workflow-profil.md` `Security: aus`, das mit dem Grund nennen und fragen, ob trotzdem geprüft werden soll.

1. **Umfang**: genannter Bereich, sonst fragen (ganzes Projekt oder Teile).
2. **Stack** aus `docs/projekt.md` („Projektstruktur“) bzw. dem Repo; passende Referenzen des Skills `security-best-practices` laden (falls installiert, sonst sagen und nach allgemeiner Praxis prüfen).
3. **Prüfen**: kritische Schwachstellen (Injection, XSS, Auth, Sessions, Secrets), Framework-spezifisches, allgemeine Praxis (Eingaben, IDs, Rechte). Im Prüfschritt alles notieren, gewichtet wird erst im Bericht.
4. **Bericht** `docs/security-reports/<YYYY-MM-DD-HHmm>-security-report.md` (Zeit mit `date`): Kurzfassung, kritische Findings, weitere nach Schwere, priorisierte Maßnahmen. Je Finding Fundstelle, Auswirkung, Fix; leere Sektionen weglassen.
5. Fragen, ob Fixes umgesetzt werden – einzeln, mit Test je Änderung, oder als Spec für `/implement`.
6. Zentrale (Skill `zentrale`; nur mit Abschnitt „Zentrale“ im Profil): jedes Finding, das nicht in dieser Session behoben wird, als Vorhaben `art: finding` mit `quelle` = Report und passendem `cmd`; entsteht eine Spec, das Vorhaben auf `Spec fertig` mit `spec`.
