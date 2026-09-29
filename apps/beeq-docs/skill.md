---
# Hand-written pointer. The skill lives in packages/beeq-skills/src/beeq and installs from the BEEQ repository.
name: beeq
description: >
  Entry point to the BEEQ agent skill for Endava's web-component design system. Use when code adds or
  changes `bq-*` elements or `@beeq/react`, `@beeq/angular`, or `@beeq/vue` components, sets up BEEQ, or
  applies a BEEQ theme, mode, or `--bq-*` token.
license: Apache-2.0
metadata:
  docs: "https://www.beeq.design"
  source: "https://github.com/Endava/BEEQ/tree/main/skills/beeq"
---

# BEEQ agent skill

The BEEQ skill lives in the [BEEQ repository](https://github.com/Endava/BEEQ/tree/main/skills/beeq). It teaches the BEEQ workflow (discover, scope, build down the ladder, verify) and carries the BEEQ design language.

## Install it

Run this in the project root. The [`skills` CLI](https://github.com/vercel-labs/skills) detects your agent and installs the skill into the folder that agent reads:

```bash
npx skills add Endava/BEEQ --skill beeq
```

Commit the installed folder so every agent on the team gets the same guidance.

## Read it without installing

An agent that cannot run the install reads the skill directly, starting from [SKILL.md](https://raw.githubusercontent.com/Endava/BEEQ/main/skills/beeq/SKILL.md). Its relative `references/` links resolve next to it, under `https://raw.githubusercontent.com/Endava/BEEQ/main/skills/beeq/references/`. Follow SKILL.md from there; this page only points to it.
