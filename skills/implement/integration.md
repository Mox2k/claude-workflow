# Integration nach main und Abschlussdateien (Schritte 8–9)

Integriert wird sofort bei Grün, nicht gesammelt am Ende: wer wartet, bekommt alle Konflikte auf einmal, in der Session, die von den fremden Features am wenigsten weiß. Bei einem Feature-Ordner läuft das je Sub-Spec.

Ohne Git oder bei rotem Lauf entfällt der Ablauf unten; der Bericht sagt, dass nichts gemergt wurde. Log und Zentrale (Schritt 9) laufen trotzdem.

## Ablauf

1. **Lock** `mkdir "$BUS/merge.lock"` – atomar, schlägt fehl, wenn er existiert. Darin `owner.txt` mit Spec, Branch, gemessener Zeit. Belegt: `status: waiting-for-merge`, einmal melden, wer integriert, minütlich neu versuchen. Den Lock immer setzen, auch wenn sonst niemand läuft – eine Session kann genau jetzt starten.
2. **`main` holen:** im Worktree `git merge main` (Merge statt Rebase: Konflikte einmal lösen, Paket-Commits bleiben Rückfallpunkte). Konflikte an einen Fix-Subagent: nur die Konfliktstellen auflösen, mit dem Wissen, welche fremde Spec die Gegenseite schrieb (Bus oder `git log`).
3. **Verifikation erneut.** Konfliktfrei heißt nicht verträglich – zwei Features können sich sauber mergen und gemeinsam brechen. Rot: Lock sofort freigeben (sonst wartet jede andere Session auf den eigenen Fix), zurück in die Fix-Zyklen, danach dieser Ablauf von vorn.
4. **Merge nach `main`:** den Worktree mit `main` über `git worktree list --porcelain` finden und dort `git -C <haupt-worktree> merge --no-ff implement/<spec>`. Uncommittete fremde Änderungen im Haupt-Worktree: Laut Profil `Merge bei unsauberem main-Worktree`. Standard: nicht mergen, Auftraggeber fragen. Steht dort „ja“, trotzdem mergen, solange Git selbst nicht abbricht (Git verweigert den Merge, wenn er eine uncommittete Datei überschreiben würde) – fremde Arbeit wird nie angefasst, weder gestasht noch zurückgesetzt.
5. **Lock freigeben**, `status: running`. Sofort, nicht erst am Laufende.

Kein `git push` – der lokale Merge ist reversibel, ein Push ist ein Effekt nach außen und bleibt beim User bzw. Orchestrator. Branch und Worktree bleiben stehen; aufgeräumt wird beim nächsten Lauf (`bus.md`).

## Log und Zentrale (Schritt 9)

**Log und `docs/projekt.md`** gehören allen Sessions. Auf einem Feature-Branch geändert, wäre jeder Merge ein Konflikt. Deshalb nach dem Merge: Lock holen, im Haupt-Worktree auf `main` schreiben, ein Commit, Lock frei.

- **Log** `docs/implement-log.md`, eine kurze Zeile je Lauf (der Inhalt liegt in `archive/done/`):
  `| <zeit> | <spec> | <S/M/L> | grün/rot | <Besonderheiten in wenigen Worten: Fix-Zyklen, offene Minors, Konflikte, nicht gemergt weil …> |`
- **`docs/projekt.md`**, nur bei grünem Lauf: „Projektstruktur“ ergänzen, wenn der Lauf Struktur, Befehle oder Stack belegbar geändert hat – kurz, eine Zeile je Sache. Sonst nichts: keine Laufzusammenfassung, keine Messwerte, keine neue Sektion.

**Zentrale** über deren Schreibweg (Skill `zentrale`, „Schreiben“) – ohne Lock, sie hat eine eigene Konfliktprüfung. Maßgeblich sind ihre Pflegeregeln und die Tabelle „Wer/Wann/Was“, nicht der Stil des Bestands. Alles in einem Publish:
- **Grün:** Vorhaben der Spec (gefunden über `spec`, den Pfad vor dem Verschieben) auf `Gebaut`, `fertig` = heute (Feature-Ordner: erst, wenn alle gewählten Sub-Specs integriert sind). Abnahme-Punkte anlegen (Abschnitt „Abnahme-Punkte anlegen“), `vorschlag` neu setzen. Kein Vorhaben zur Spec gefunden → neues anlegen (nächste Nummer, `spec`, Bereich und Meilenstein nur aus den vorhandenen, sonst weglassen und im Bericht sagen).
- **Immer:** `aktiv` weg. Rot ändert sonst nichts.

Fehlt der Abschnitt „Zentrale“ im Profil: nichts schreiben, im Bericht auf `/projekt-setup` verweisen.
