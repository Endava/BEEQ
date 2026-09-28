# @beeq/skills

Source, tests, and evals for the BEEQ agent skills. Consumers install the generated [`skills/`](../../skills) folder with `npx skills add Endava/BEEQ --skill beeq`; nothing here is published to npm.

| Path | What it is |
|---|---|
| `src/<skill>/` | Skill source: `SKILL.md` plus `references/*.md`. **The only place to edit a skill.** |
| `src/README.md` | Source of `skills/README.md`, the page consumers see on GitHub. |
| `__tests__/` | Structure, API-accuracy, and eval-suite specs (`nx run beeq-skills:test`). |
| `evals/` | The skillgrade suite run by `nx run beeq-skills:eval`. |

Contributor-only skills stay in `.agents/skills/` with `metadata.internal: true`, so `npx skills` hides them from consumers.

## Editing a skill

1. Edit `src/beeq/`. Link between skill files with relative paths and to anything else with absolute URLs; the docs copies rewrite relative links to `beeq.design` URLs.
2. Run `pnpm skills:sync` (`nx sync`). It writes `skills/beeq/**`, `apps/beeq-docs/skill.md`, and `apps/beeq-docs/skill/references/*.mdx`. The references stay MDX pages because Mintlify serves the raw `/skill/references/<name>.md` URLs the skill links to only for pages; the generator adds `hidden: true` so they stay out of site search, sitemaps, and Mintlify's AI context. Commit them with the source; the pre-commit hook runs the sync for you.
3. Run `pnpm skills:test`: the specs, the type check, and the `tools` specs.

`nx sync:check` fails in CI when a generated copy is stale. The generator also rejects invalid frontmatter, relative links that break or leave the skill folder, references not linked from `SKILL.md`, and MDX-unsafe characters in the docs skill.

## Evals

The suite measures whether the skill improves agent output, following [agentskills.io](https://agentskills.io/skill-creation/evaluating-skills): each task runs with the skill (`with-skill`) and without it (`baseline`), and `benchmark.json` reports the reward delta.

```bash
pnpm exec nx run beeq-skills:eval --validate               # reference solutions must score 1.0; no agent, no cost
pnpm exec nx run beeq-skills:eval --list                   # print the selected tasks
pnpm exec nx run beeq-skills:eval -c smoke                 # 4 smoke tasks × 5 trials × 2 variants
pnpm exec nx run beeq-skills:eval --eval=tooltip-truncation --agent=claude --model=claude-sonnet-4-5
```

Configurations: `smoke` (tasks tagged `smoke`, 5 trials), `reliable` (15), `regression` (30). Without a configuration every task runs once. Useful options: `--agent` (`copilot`, `claude`, or `codex`), `--model`, `--variants`, `--filter=stack=react`, `--grader=deterministic`, `--threshold`. See `tools/src/executors/skill-eval/schema.json` for the rest.

Every trial runs a real agent CLI, so it costs requests: 15 tasks × 2 variants is 30 agent runs per trial. The suite therefore runs only locally, on demand, with the CLI you are logged in to; CI runs only `--validate`, which starts no agent. Start with `--eval` or `-c smoke`.

**Results** go to `tmp/skill-evals/iteration-N/`: one skillgrade folder per variant plus `benchmark.json`. To view them:

```bash
pnpm skills:eval:view                                                 # latest iteration, with-skill, in the browser
pnpm exec nx run beeq-skills:eval --preview=browser --variants=baseline --iteration=1
pnpm exec nx run beeq-skills:eval --preview=cli                       # every variant, in the terminal
```

**Grading.** Each trial's reward is the weighted mean of two graders:

- `graders/grade.ts` (weight 0.7, deterministic): the agent wrote files, the SKILL.md Verify searches are clean, every BEEQ element, prop, event, part, and token exists in the component source, and the task's own `checks` pass.
- `rubric.md` (weight 0.3, LLM): scored against the task's `criteria`. It runs only when `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `GEMINI_API_KEY` is set; otherwise the executor warns and grades deterministically.

**Baseline hygiene.** The baseline must not see the skill any other way. `prepare.ts` refuses to run when a personal `beeq` skill exists in `~/.agents/skills`, `~/.copilot/skills`, or `~/.claude/skills`. The agent wrapper runs Copilot with `--no-custom-instructions` and the user's MCP servers disabled, Claude with `--strict-mcp-config`, and Codex with a throwaway `CODEX_HOME` that holds only a link to the user's `auth.json`, so Codex config, MCP servers, memories, `AGENTS.md`, plugins, and hooks stay out. Codex needs `codex login` or `CODEX_API_KEY`.

### Recorded baseline

Full suite (`pnpm exec nx run beeq-skills:eval`), 2026-09-28, skill at `f8da1aef`: Copilot CLI with its default model, 1 trial per task, deterministic graders only.

| | with-skill | baseline | delta |
|---|---|---|---|
| Mean reward | 0.99 (sd 0.04) | 0.69 (sd 0.20) | +0.30 |
| Pass rate (reward ≥ 0.5) | 1.00 | 0.87 | +0.13 |

| Task | with-skill | baseline | delta |
|---|---|---|---|
| `angular-select` | 1.00 | 1.00 | +0.00 |
| `brand-button-override` | 1.00 | 0.71 | +0.29 |
| `destructive-confirm` | 1.00 | 0.50 | +0.50 |
| `details-panel-drawer` | 1.00 | 0.38 | +0.63 |
| `endava-theme-dark` | 1.00 | 0.60 | +0.40 |
| `html-contact-form` | 1.00 | 0.80 | +0.20 |
| `icon-only-toolbar` | 1.00 | 0.57 | +0.43 |
| `next-dialog` | 0.86 | 0.57 | +0.29 |
| `react-settings-form` | 1.00 | 1.00 | +0.00 |
| `row-actions-dropdown` | 1.00 | 0.88 | +0.13 |
| `save-error-alert` | 1.00 | 0.57 | +0.43 |
| `side-menu-navigation` | 1.00 | 0.80 | +0.20 |
| `spa-link-routing` | 1.00 | 1.00 | +0.00 |
| `tooltip-truncation` | 1.00 | 0.44 | +0.56 |
| `vue-list-states` | 1.00 | 0.57 | +0.43 |

`angular-select`, `react-settings-form`, and `spa-link-routing` score 1.00 in both variants, so under deterministic grading they catch regressions but do not show the skill's effect.

The `eval` target's `threshold` is 0.9 (`project.json`): more than twice the with-skill spread below its mean, and it fails once the skill loses about a third of its lift over the baseline. It was set from Copilot runs, so record a baseline before reading another agent's pass or fail; `--threshold=0` reports without failing. After changing the skill or the tasks, rerun the full suite and update this section and the threshold together.

### Suite layout

The executor copies `evals/` to a temp folder outside the repo, fills `{{evals}}` with that path, and writes one skillgrade `eval.yaml` per variant.

| File | Role |
|---|---|
| `eval.base.yaml` | skillgrade `defaults` (the agent command) and the default `graders`. |
| `tasks/<name>.yaml` | One skillgrade task. `name` must match the file name. |
| `footer.md` | Appended to every instruction; `{{metadata.KEY}}` reads task metadata. |
| `prepare.ts` | Runs first: writes `beeq-index.json` (the API index the grader reads) and one `fixtures/<stack>/` consumer project per stack: a `package.json`, plus an app shell with no BEEQ setup for React. Tasks copy the whole folder, and the grader ignores fixture files the agent left untouched. |
| `solutions/<name>.sh` | Reference answer for `--validate`. Writes files, then `rm -- "$0"` so the grader sees only the answer. |
| `agents/run.ts` | Runs Copilot, Claude, or Codex in the workspace and prints the reply plus every file written. |
| `graders/grade.ts`, `lib/*.ts` | The deterministic grader and the BEEQ API index and rules it uses. |

The `.ts` files run under Node's type stripping with no build step, so they use erasable syntax only and import siblings with `.ts` extensions. `nx run beeq-skills:typecheck` enforces both.

### Adding a task

1. Copy a task in `tasks/`. Set `metadata.stack` (`html`, `react`, `next`, `angular`, `vue`) and `metadata.tags`; add `smoke` only to keep the smoke set small and fast.
2. Write `instruction` as a consumer would ask, without naming the rule under test.
3. Put grading data in `expected`, which only graders see: `criteria` for the rubric, `checks` (`match` and `absent` regexes, optional `flags`), `allow_rules` for rule ids the task may break, and `allow_api` for `kind:name` API issues.
4. For smoke tasks, add `solutions/<name>.sh` and run `--validate`.
5. Run `nx run beeq-skills:test`; it checks every task parses and every regex compiles.

**Leakage.** The agent never sees `expected`, the grader, or the rubric: skillgrade keeps `expected` out of the prompt, and the agent wrapper moves `tests/`, `prompts/`, and `environment/` out of the workspace while the agent runs. An agent that goes looking outside its workspace could still find the temp suite copy; review transcripts when a score looks too good.
