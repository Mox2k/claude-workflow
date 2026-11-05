#!/usr/bin/env bash
# Builds one upload package (zip) per workflow skill for the Claude app
# (Customize -> Skills -> upload). Output: pakete/<name>.zip (not versioned).
# Zip entries use forward slashes (<name>/SKILL.md ...), as the app expects.
set -eu
cd "$(dirname "$0")"
rm -rf pakete && mkdir pakete
python - <<'PY'
import pathlib, zipfile
for d in sorted(pathlib.Path('skills').iterdir()):
    if not (d / 'SKILL.md').is_file():
        continue
    out = pathlib.Path('pakete') / f'{d.name}.zip'
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in sorted(d.rglob('*')):
            if f.is_file():
                z.write(f, f.relative_to('skills').as_posix())
    print(out.as_posix())
PY
