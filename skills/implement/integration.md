# Integration nach main und Abschlussdateien (Schritte 8–9)

Integriert wird sofort bei Grün, nicht gesammelt am Ende: wer wartet, bekommt alle Konflikte auf einmal, in der Session, die von den fremden Features am wenigsten weiß. Bei einem Feature-Ordner läuft das je Sub-Spec.

Ohne Git oder bei rotem Lauf entfällt alles hier; der Bericht sagt, dass nichts gemergt wurde.

## Ablauf

1. **Lock** `mkdir "$BUS/merge.lock"` – atomar, schlägt fehl, wenn er existiert. Darin `owner.txt` mit Spec, Branch, gemessener Zeit. Belegt: `status: waiting-for-merge`, einmal melden, wer integriert, minütlich neu versuchen. Den Lock immer setzen, auch wenn sonst niemand läuft – eine Session kann genau jetzt starten.
2. **`main` holen:** im Worktree `git merge main` (Merge statt Rebase: Konflikte einmal lösen, Paket-Commits bleiben Rückfallpunkte). Konflikte an einen Fix-Subagent: nur die Konfliktstellen auflösen, mit dem Wissen, welche fremde Spec die Gegenseite schrieb (Bus oder `git log`).
3. **Verifikation erneut.** Konfliktfrei heißt nicht verträglich – zwei Features können sich sauber mergen und gemeinsam brechen. Rot: Lock sofort freigeben (sonst wartet jede andere Session auf den eigenen Fix), zurück in die Fix-Zyklen, danach dieser Ablauf von vorn.
4. **Merge nach `main`:** den Worktree mit `main` über `git worktree list --porcelain` finden und dort `git -C <haupt-worktree> merge --no-ff implement/<spec>`. Uncommittete fremde Änderungen im Haupt-Worktree: Laut Profil `Merge bei unsauberem main-Worktree`. Standard: nicht mergen, Auftraggeber fragen. Steht dort „ja“, trotzdem mergen, solange Git selbst nicht abbricht (Git verweigert den Merge, wenn er eine uncommittete Datei überschreiben würde) – fremde Arbeit wird nie angefasst, weder gestasht noch zurückgesetzt.
5. **Lock freigeben**, `status: running`. Sofort, nicht erst am Laufende.

Kein `git push` – der lokale Merge ist reversibel, ein Push ist ein Effekt nach außen und bleibt beim User bzw. Orchestrator. Branch und Worktree bleiben stehen; aufgeräumt wird beim nächsten Lauf (`bus.md`).

## Roadmap und Log (Schritt 9)

`docs/projekt-roadmap.md` und `docs/superpowers/implement-log.md` gehören allen Sessions. Auf einem Feature-Branch geändert, wäre jeder Merge ein Konflikt. Deshalb nach dem Merge: Lock holen, im Haupt-Worktree auf `main` schreiben, ein Commit, Lock frei.

**Roadmap**, nur bei grünem Lauf. Maßgeblich ist ihr Abschnitt 0 „Pflegeregeln“, nicht der Stil des Bestands. Genau zwei Änderungen:
- In Abschnitt 4 die Zeile der Spec auf `Gebaut` setzen (Feature-Ordner: erst, wenn alle gewählten Sub-Specs integriert sind). Keine Zeile gefunden → neue anlegen (nächste Nummer, Spec-Pfad, Bereich zuordnen, sonst `—`; nie einen Bereich erfinden).
- Abschnitt 2 „Projektstruktur“ ergänzen, wenn der Lauf Struktur, Befehle oder Stack belegbar geändert hat – kurz, eine Zeile je Sache.

Sonst nichts: keine Laufzusammenfassung, keine Messwerte, keine neue Sektion. Fehlt die Roadmap oder trägt sie `ROADMAP_STATUS: UNBEARBEITET`, nichts schreiben und auf `/prime` verweisen.

**Log**, eine kurze Zeile je Lauf (der Inhalt liegt in `archive/done/`):
`| <zeit> | <spec> | <S/M/L> | grün/rot | <Besonderheiten in wenigen Worten: Fix-Zyklen, offene Minors, Konflikte, nicht gemergt weil …> |`
