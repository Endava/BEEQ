#!/usr/bin/env bash
# Reference answer for brand-button-override, used by `nx run beeq-skills:eval --validate`.
set -euo pipefail
mkdir -p src
cat > src/brand.css <<'EOF'
/* Brand colour set once on the semantic tokens, so buttons and every other BEEQ component follow it. */
:root {
  --bq-ui--brand: #6B2FBA;
  --bq-ui--brand-alt: color-mix(in srgb, var(--bq-ui--brand) 85%, black);
  --bq-text--brand: var(--bq-ui--brand);
  --bq-stroke--brand: var(--bq-ui--brand);
}
EOF
cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Marketing</title>
    <link rel="stylesheet" href="/node_modules/@beeq/core/dist/beeq/beeq.css" />
    <link rel="stylesheet" href="/src/brand.css" />
    <script type="module" src="/node_modules/@beeq/core/dist/beeq/beeq.esm.js"></script>
  </head>
  <body>
    <bq-button variant="standard">Get started</bq-button>
  </body>
</html>
EOF
rm -- "$0"
