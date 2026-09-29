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
3. Run `pnpm skills:test`: the specs and type checks for `beeq-skills` and `tools`.

CircleCI runs `nx sync:check`, then `check`, `typecheck`, and `test` for whichever of `beeq-skills` and `tools` a change affects, plus `eval-validate` when `beeq-skills` is affected. `nx sync:check` fails when a generated copy is stale. The generator also rejects invalid frontmatter, relative links that break or leave the skill folder, references not linked from `SKILL.md`, and MDX-unsafe characters in the docs skill.

## Evals

The suite measures whether the skill improves agent output, following [agentskills.io](https://agentskills.io/skill-creation/evaluating-skills): each task runs with the skill (`with-skill`) and without it (`baseline`), and `benchmark.json` reports the reward delta.

```bash
pnpm exec nx run beeq-skills:eval-validate                # reference solutions must score 1.0; no agent, no cost
pnpm exec nx run beeq-skills:eval --list                   # print the selected tasks
pnpm exec nx run beeq-skills:eval -c smoke                 # 4 smoke tasks × 5 trials × 2 variants
pnpm exec nx run beeq-skills:eval --eval=tooltip-truncation --agent=claude --model=claude-sonnet-4-5
```

Configurations: `smoke` (tasks tagged `smoke`, 5 trials), `reliable` (15), `regression` (30). Without a configuration every task runs once. Useful options: `--agent` (`copilot`, `claude`, or `codex`), `--model`, `--variants`, `--filter=stack=react`, `--grader=deterministic`, `--threshold`. See `tools/src/executors/skill-eval/schema.json` for the rest.

Every trial runs a real agent CLI, so it costs requests: 15 tasks × 2 variants is 30 agent runs per trial. The suite therefore runs only locally, on demand, with the CLI you are logged in to; CI runs only `eval-validate`, which starts no agent. Start with `--eval` or `-c smoke`.

**Results** go to `tmp/skill-evals/iteration-N/`: one skillgrade folder per variant plus `benchmark.json`. `eval-validate` writes to `tmp/skill-evals/validate/` instead, so a validation run never becomes the latest iteration. To view them:

```bash
pnpm skills:eval:view                                                 # latest iteration, with-skill, in the browser
pnpm exec nx run beeq-skills:eval --preview=browser --variants=baseline --iteration=1
pnpm exec nx run beeq-skills:eval --preview=cli                       # every variant, in the terminal
```

**Grading.** Each trial's reward is the weighted mean of two graders:

- `graders/grade.ts` (weight 0.7, deterministic): the agent wrote files, the SKILL.md Verify searches are clean, every BEEQ element, prop, event, part, and token exists in the component source, and the task's own `checks` pass.
- `rubric.md` (weight 0.3, LLM): scored against the task's `criteria`. It runs only when `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `GEMINI_API_KEY` is set; otherwise the executor warns and grades deterministically. `--graderProvider` and `--graderModel` pick the judge. A failed rubric call (no credit, rate limit) scores 0 and the run carries on, capping every trial at 0.70, so check the first result's rubric details before leaving a long run going.

**Baseline hygiene.** The baseline must not see the skill any other way. `prepare.ts` refuses to run when a personal `beeq` skill exists in `~/.agents/skills`, `~/.copilot/skills`, or `~/.claude/skills`. The agent wrapper runs Copilot with `--no-custom-instructions` and the user's MCP servers disabled, Claude with `--strict-mcp-config`, and Codex with a throwaway `CODEX_HOME` that holds only a link to the user's `auth.json`, so Codex config, MCP servers, memories, `AGENTS.md`, plugins, and hooks stay out. Codex needs `codex login` or `CODEX_API_KEY`.

### Recorded baseline

Two full-suite runs with Copilot CLI's default model, 1 trial per task. The skill is the same in both (last changed in `1ed7522b`), so the gap between their with-skill means is run-to-run variance.

| Run | Graders | with-skill | baseline | delta | Pass rate (reward ≥ 0.5) |
|---|---|---|---|---|---|
| 2026-09-28, `f8da1aef` | deterministic | 0.99 (sd 0.04) | 0.69 (sd 0.20) | +0.30 | 1.00 vs 0.87 |
| 2026-09-29, `15016f0d` | deterministic + rubric (OpenAI `gpt-4.1-mini`) | 0.96 (sd 0.08) | 0.76 (sd 0.18) | +0.21 | 1.00 vs 0.93 |

The second run is `pnpm exec nx run beeq-skills:eval --grader=all --graderProvider=openai --graderModel=gpt-4.1-mini`. Its tasks:

| Task | with-skill | baseline | delta |
|---|---|---|---|
| `angular-select` | 1.00 | 1.00 | +0.00 |
| `brand-button-override` | 1.00 | 0.71 | +0.29 |
| `destructive-confirm` | 1.00 | 1.00 | +0.00 |
| `details-panel-drawer` | 1.00 | 0.38 | +0.62 |
| `endava-theme-dark` | 1.00 | 0.68 | +0.33 |
| `html-contact-form` | 1.00 | 0.68 | +0.33 |
| `icon-only-toolbar` | 1.00 | 0.76 | +0.24 |
| `next-dialog` | 1.00 | 0.63 | +0.38 |
| `react-settings-form` | 1.00 | 0.81 | +0.18 |
| `row-actions-dropdown` | 1.00 | 1.00 | +0.00 |
| `save-error-alert` | 0.85 | 0.58 | +0.28 |
| `side-menu-navigation` | 1.00 | 0.81 | +0.18 |
| `spa-link-routing` | 1.00 | 1.00 | +0.00 |
| `tooltip-truncation` | 0.89 | 0.60 | +0.29 |
| `vue-list-states` | 0.71 | 0.72 | -0.01 |

`angular-select` and `spa-link-routing` score 1.00 in both variants in both runs, so they catch regressions but do not show the skill's effect.

The rubric is not an independent signal: skillgrade puts the deterministic results in the judge's prompt, and in this run the with-skill rubric scores matched them to within 0.02 on every task. On the baseline the judge was more lenient (0.81 against 0.73 deterministic), which raises the baseline mean. Compare runs only when they use the same graders and grader model.

The `eval` target's `threshold` is 0.9 (`project.json`): 0.06 to 0.09 under the with-skill means, so it fails once the skill loses about 30% of its lift over the baseline. It was set from Copilot runs, so record a baseline before reading another agent's pass or fail; `--threshold=0` reports without failing. After changing the skill or the tasks, rerun the full suite and update this section and the threshold together.

### Suite layout

The executor copies `evals/` to a temp folder outside the repo, fills `{{evals}}` with that path, and writes one skillgrade `eval.yaml` per variant.

| File | Role |
|---|---|
| `eval.base.yaml` | skillgrade `defaults` (the agent command) and the default `graders`. |
| `tasks/<name>.yaml` | One skillgrade task. `name` must match the file name. |
| `footer.md` | Appended to every instruction; `{{metadata.KEY}}` reads task metadata. |
| `prepare.ts` | Runs first: writes `beeq-index.json` (the API index the grader reads) and one `fixtures/<stack>/` consumer project per stack: a `package.json`, plus an app shell with no BEEQ setup for React. Tasks copy the whole folder, and the grader ignores fixture files the agent left untouched. |
| `solutions/<name>.sh` | Reference answer for `eval-validate`. Writes files, then `rm -- "$0"` so the grader sees only the answer. |
| `agents/run.ts` | Runs Copilot, Claude, or Codex in the workspace and prints the reply plus every file written. |
| `graders/grade.ts`, `lib/*.ts` | The deterministic grader and the BEEQ API index and rules it uses. |

The `.ts` files run under Node's type stripping with no build step, so they use erasable syntax only and import siblings with `.ts` extensions. `nx run beeq-skills:typecheck` enforces both.

### Adding a task

1. Copy a task in `tasks/`. Set `metadata.stack` (`html`, `react`, `next`, `angular`, `vue`) and `metadata.tags`; add `smoke` only to keep the smoke set small and fast.
2. Write `instruction` as a consumer would ask, without naming the rule under test.
3. Put grading data in `expected`, which only graders see: `criteria` for the rubric, `checks` (`match` and `absent` regexes, optional `flags`), `allow_rules` for rule ids the task may break, and `allow_api` for `kind:name` API issues.
4. For smoke tasks, add `solutions/<name>.sh` and run `nx run beeq-skills:eval-validate`.
5. Run `nx run beeq-skills:test`; it checks every task parses and every regex compiles.

**Leakage.** The agent never sees `expected`, the grader, or the rubric: skillgrade keeps `expected` out of the prompt, and the agent wrapper moves `tests/`, `prompts/`, and `environment/` out of the workspace while the agent runs. An agent that goes looking outside its workspace could still find the temp suite copy; review transcripts when a score looks too good.
