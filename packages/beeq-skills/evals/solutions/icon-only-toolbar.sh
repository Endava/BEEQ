#!/usr/bin/env bash
# Reference answer for icon-only-toolbar, used by `nx run beeq-skills:eval --validate`.
set -euo pipefail
cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Editor</title>
    <link rel="stylesheet" href="/node_modules/@beeq/core/dist/beeq/beeq.css" />
    <script type="module" src="/node_modules/@beeq/core/dist/beeq/beeq.esm.js"></script>
  </head>
  <body>
    <div role="toolbar" aria-label="Text formatting">
      <bq-button appearance="text" only-icon label="Bold"><bq-icon name="text-b"></bq-icon></bq-button>
      <bq-button appearance="text" only-icon label="Italic"><bq-icon name="text-italic"></bq-icon></bq-button>
      <bq-button appearance="text" only-icon label="Underline"><bq-icon name="text-underline"></bq-icon></bq-button>
      <bq-button appearance="text" only-icon label="Insert link"><bq-icon name="link"></bq-icon></bq-button>
    </div>
  </body>
</html>
EOF
rm -- "$0"
