#!/usr/bin/env bash
# Reference answer for brand-button-override, used by `nx run beeq-skills:eval --validate`.
set -euo pipefail
mkdir -p src
cat > src/brand.css <<'CSS'
/* The base brand tokens, set once. Every brand role, hover and pressed fill included, derives from them. */
:root {
  --bq-brand: #6B2FBA;
  --bq-brand-light: color-mix(in srgb, var(--bq-brand) 15%, white);
  --bq-brand-dark: color-mix(in srgb, var(--bq-brand) 60%, black);
  --bq-focus: var(--bq-brand);
}
CSS
cat > index.html <<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Marketing</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@beeq/core/dist/beeq/beeq.css" />
    <link rel="stylesheet" href="/src/brand.css" />
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@beeq/core/dist/beeq/beeq.esm.js"
      data-beeq="https://cdn.jsdelivr.net/npm/@beeq/core/dist/beeq/svg/"
    ></script>
  </head>
  <body>
    <bq-button>Get started</bq-button>
  </body>
</html>
HTML
rm -- "$0"
