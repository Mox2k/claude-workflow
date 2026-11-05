# Modi

## Bootstrap (Katalog fehlt)

Stack, Start-Befehl und Verzeichnisse aus Roadmap Abschnitt 2 übernehmen, nicht erneut fragen. Den Rest erfragen: Kurzbeschreibung, Frontend-/Backend-URL, Hauptfeatures, Login (Test-User und wo die Zugangsdaten liegen). Fehlt Stack oder Start-Befehl in der Roadmap, dort nachtragen. Unklare Routen → Code-Inventur anbieten. Features nach dem Zuschnitt in `bausteine.md` als `F-NN` anlegen, fehlende Details als Stub. Kam der Aufruf mit Modus-Argument, danach direkt weiter.

## Test

1. Vorprüfung: Frontend antwortet, Backend-Health falls dokumentiert, Login falls nötig.
2. Auswahl aus dem Argument; Freitext → temporäres Feature `F-CUSTOM-1…` (bei unklarer URL oder Schritten fragen).
3. Je Feature die Schritte ausführen, Console und Netzwerk beobachten, gegen UI- und Hintergrund-Akzeptanz prüfen. Hintergrund aktiv verfolgen: Seiteneffekt-Endpunkte im Netzwerk, sekundäre Seiten (Feed, Suche, Sitemap), Grenzfälle (Doppelklick, Sonderzeichen, Limits).
4. Fixes und Re-Tests nach den Regeln im SKILL.
5. Abschluss und Report nach den Regeln im SKILL. Lief ein Freitext-Test, fragen, ob er als `F-NN` in den Katalog soll (zu klein → als Akzeptanz an ein vorhandenes Feature).

## Abgleich (`scan [F-NN|bereich]`)

Code-Inventur, dann gegen den Katalog: `neu` (Route ohne Feature), `stale` (Feature ohne Route/Komponente), `unvollständig` (neue Unterseiten, Felder, Aktionen). Tabelle zeigen, je Eintrag anlegen/entfernen/erweitern/überspringen bestätigen lassen. Neue IDs fortlaufend ab dem Höchsten, nie Lücken füllen. Inhalt aus dem Code, nichts erfinden.

## Bug-Hunt (`hunt`)

Schleife über die Features (reihum, nach vollem Durchlauf gemischt), testen wie oben und zusätzlich auf unerwartete Fehler und Layoutbrüche achten; Bug → sofort Fix und Re-Test. Ende bei `failed`/`regressed`, nach 30 Runden oder 45 Minuten, oder wenn der User etwas anderes als „weiter“ schreibt. Bericht mit Runden und Abbruchgrund, Report `runs/<datum>-hunt.md`.

## Diff (`diff`)

Scope: uncommittete Änderungen, sonst `<main>..HEAD`; unklar → nach der Basis fragen. Geänderte Dateien auf Routen abbilden, gegen `URL:` der Features matchen, Zuordnung (und nicht zuordenbare Dateien) zeigen und bestätigen lassen, dann wie Test.

## Replay (`replay`)

Neuester Report (oder genannter Pfad / genannte `B-NNN`): alle Findings ≠ `fixed` laden, IDs behalten, je Finding reproduzieren. Reproduziert → `open`, Fix wie üblich. Nicht reproduzierbar → `not-reproducible`, kommt in keinen neuen Report. Report `runs/<datum>-replay.md`.
