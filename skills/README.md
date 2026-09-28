<!-- Generated from packages/beeq-skills/src/README.md. Edit the source, not this file. -->

# Agent skills

Skills in this folder are public: consumers install them into their own projects with the [`skills` CLI](https://github.com/vercel-labs/skills).

| Skill | What it does |
| --- | --- |
| [`beeq`](beeq/SKILL.md) | Builds, styles, and reviews UI with BEEQ components, and carries the BEEQ design language. |

```bash
npx skills add Endava/BEEQ --skill beeq            # latest
npx skills add Endava/BEEQ#v1.15.0 --skill beeq    # pinned to a release
```

Contributor skills for working on BEEQ itself live in [`.agents/skills/`](https://github.com/Endava/BEEQ/tree/main/.agents/skills). They carry `metadata.internal: true`, so the CLI hides them unless `INSTALL_INTERNAL_SKILLS=1` is set.

To change a skill, edit its source in [`packages/beeq-skills`](https://github.com/Endava/BEEQ/tree/main/packages/beeq-skills); this folder is regenerated from it.
