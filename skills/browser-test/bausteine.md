# Bausteine

## Code-Inventur

Framework über Repo-Marker (`package.json` mit next/react/vue/svelte/nuxt/remix, `pyproject.toml`/`requirements.txt` mit fastapi/django/flask, `go.mod`, `Cargo.toml`, `Gemfile`, `composer.json`). Routen je Framework (z. B. Next `app/**/page.*`, `pages/**`, Vue/Nuxt `pages/**/*.vue`, Router- und Decorator-Definitionen), Navigation aus `Sidebar`/`Nav`/`Menu`-Komponenten, Backend-Endpunkte. Unklares vorlegen, nicht raten.

## Feature-Zuschnitt

Ein `F-NN` ist eine Fähigkeit mit echtem Wert für den Nutzer, die im Hintergrund eine Kette von Effekten auslöst: „Artikel veröffentlichen“, „Bestellung abschicken“. Keine eigenen Features sind UI-Mechaniken wie „Dialog öffnet sich“ – die werden Akzeptanzkriterium des passenden Features. Würde ein Feature einen Lauf sprengen (~100k Token), in 2–3 zusammenhängende teilen und das vorschlagen. Akzeptanz deckt sichtbares Verhalten und nachprüfbare Hintergrundeffekte ab.

## Finding

`B-NNN — <Kurztitel>` · Feature · Schwere · Status · URL · Schritte · Erwartet · Tatsächlich · Console · Netzwerk · Notizen; bei `failed` Notizen zum Fix-Versuch, bei `regressed` zur Regression.

## Fix-Auftrag

`general-purpose`-Subagent, Beschreibung `Fix B-NNN — <Titel>` (gesammelt: `Fix minor/cosmetic — N Findings`). Aufwand: `blocker`/`major` → `medium` mit `superpowers:systematic-debugging`; `minor`/`cosmetic` → Sonnet, `low`. Inhalt: vollständige Reproduktion, Projektregeln aus dem Profil, Ursache finden, kleinster Fix ohne Umbauten nebenbei, nichts Destruktives. Rückmeldung je Finding `fixed` (Commit oder Dateien plus Notiz) oder `failed` mit Notizen.
