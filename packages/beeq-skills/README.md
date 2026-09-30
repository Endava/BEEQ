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

1. Edit `src/beeq/`. Link between skill files with relative paths and to anything else with absolute URLs.
2. Run `pnpm skills:sync` (`nx sync`). It writes `skills/beeq/**`. Commit it with the source; the pre-commit hook runs the sync for you.
3. Run `pnpm skills:test`: the specs and type checks for `beeq-skills` and `tools`.

CircleCI runs `nx sync:check`, then `check`, `typecheck`, and `test` for whichever of `beeq-skills` and `tools` a change affects, plus `eval-validate` when `beeq-skills` is affected. `nx sync:check` fails when the generated copy is stale. The generator also rejects invalid frontmatter, relative links that break or leave the skill folder, and references not linked from `SKILL.md`.

`apps/beeq-docs/skill.md` is a hand-written pointer to the skill in this repository, outside the sync. Keep it: without a custom `skill.md`, Mintlify generates its own skill from the docs and serves it at `https://www.beeq.design/skill.md`. Its frontmatter is a copy of `src/beeq/SKILL.md`'s, and `pnpm skills:test` fails until a frontmatter change is copied to it.

## Evals

The suite measures whether the skill improves agent output, following [agentskills.io](https://agentskills.io/skill-creation/evaluating-skills): each task runs with the skill (`with-skill`) and without it (`baseline`), and `benchmark.json` reports the reward delta.

### Prerequisites

| You need | For | Notes |
|---|---|---|
| The Node and pnpm versions pinned in the root `package.json` (`volta`), then `pnpm install` | Every eval target | A Unix shell (macOS, Linux, or WSL): the reference solutions are Bash scripts, and skillgrade creates its workspaces under `/tmp`. No build and no Docker: the grader reads the component source. |
| An agent CLI on your `PATH`, logged in | `eval` | `copilot` (the default), `claude`, or `codex` (`codex login` or `CODEX_API_KEY`). Every trial spends that account's requests. |
| No personal `beeq` skill | `eval` with the `baseline` variant | Remove it from `~/.agents/skills`, `~/.copilot/skills`, and `~/.claude/skills`, or the run stops. See [Baseline hygiene](#baseline-hygiene). |
| A judge key: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `GEMINI_API_KEY` | The LLM rubric; optional | Export it in the shell that runs Nx; the root `.env` is committed, so keep keys out of it. Without a key, `--grader=auto` (the default) warns and grades deterministically, and `--grader=all` stops. |

`eval-validate` needs only the first row: it starts no agent and calls no judge.

With a judge key, pass `--graderModel` too. Without it, skillgrade lists the provider's models at run time and picks a recent one, so the judge changes without notice, and a key without permission to list models fails there (OpenAI answers HTTP 403). The first key found (Anthropic, then OpenAI, then Gemini) sets the provider unless `--graderProvider` picks one. Use `gpt-4.1` or a stronger model: `gpt-4.1-mini` reported attribute values the code did not contain.

The agents run unattended: Copilot with `--allow-all-tools`, Claude with `--permission-mode acceptEdits`, and Codex in its `workspace-write` sandbox with network access. They start in a temp workspace, but Copilot can run any shell command without asking, so run evals on a machine where that is acceptable.

### How a run works

1. The `eval` target runs the sync first, so `skills/beeq` matches `src/beeq` when the suite reads it.
2. The executor copies `evals/` to a temp folder, and `prepare.ts` writes the API index and one fixture app per stack (see [Suite layout](#suite-layout)). With the rubric on, the executor then sends the judge one short request, so a missing key, unknown model, or empty quota stops the run for the cost of that call.
3. For each task, variant, and trial, skillgrade copies the task's files into a `/tmp/skillgrade-*` workspace. For `with-skill` it also copies `skills/beeq` into the workspace's `.agents/skills/` and `.claude/skills/`; `baseline` gets no skill. `agents/run.ts` then runs the agent CLI on the task prompt, for up to 600 s (`--timeout`).
4. The graders score the files the agent wrote (see [Grading](#grading)); the trial's reward is their weighted mean.
5. `benchmark.json` reports each variant's mean reward and the delta. The target fails when the with-skill mean is below `threshold` (0.9, see [Recorded baseline](#recorded-baseline)).

### Running

```bash
pnpm exec nx run beeq-skills:eval-validate                # reference solutions must score 1.0; no agent, no cost
pnpm exec nx run beeq-skills:eval --list                   # print the selected tasks
pnpm exec nx run beeq-skills:eval -c smoke                 # 4 smoke tasks × 5 trials × 2 variants
pnpm exec nx run beeq-skills:eval --eval=tooltip-truncation --agent=claude --model=claude-sonnet-4-5
```

Configurations: `smoke` (tasks tagged `smoke`, 5 trials), `reliable` (15), `regression` (30). Without a configuration every task runs once. Useful options: `--agent` (`copilot`, `claude`, or `codex`), `--model`, `--variants`, `--filter=stack=react`, `--grader=deterministic`, `--threshold`. See `tools/src/executors/skill-eval/schema.json` for the rest.

Every trial runs a real agent CLI, so it costs requests: 15 tasks × 2 variants is 30 agent runs per trial, and the reference run below took about 45 minutes with `--concurrent`. The suite therefore runs only locally, on demand, with the CLI you are logged in to; CI runs only `eval-validate`, which starts no agent. Start with `--eval` or `-c smoke`, and see [Rerunning for less](#rerunning-for-less) before repeating a run. To compare a run with the [recorded baseline](#recorded-baseline), use its agent, model, and judge; the reference command is listed there.

**Results** go to `tmp/skill-evals/iteration-N/`: one skillgrade folder per variant plus `benchmark.json`. `eval-validate` writes to `tmp/skill-evals/validate/` instead, so a validation run never becomes the latest iteration. To view them:

```bash
pnpm skills:eval:view                                                 # latest iteration, with-skill, in the browser
pnpm exec nx run beeq-skills:eval --preview=browser --variants=baseline --iteration=1
pnpm exec nx run beeq-skills:eval --preview=cli                       # every variant, in the terminal
```

### Grading

Each trial's reward is the weighted mean of two graders:

- `graders/grade.ts` (weight 0.7, deterministic): the agent wrote files, the SKILL.md Verify searches are clean, every BEEQ element, prop, event, part, and token exists in the component source, every literal value of a string-union prop (`type="error"`) is one the prop accepts, and the task's own `checks` pass.
- `rubric.md` (weight 0.3, LLM): scored against the task's `criteria`, only with a judge key (see [Prerequisites](#prerequisites)). The executor runs it before the deterministic grader, because skillgrade shows the judge every earlier grader's result and a judge that sees them echoes them. A judge call that hits a rate limit or an overload (HTTP 429, 5xx, or 529) waits as long as the API asks, or backs off from 1 s, and retries for up to 90 s, so a regrade, which sends judge calls back to back, paces itself to the account's tokens-per-minute limit. A spent quota, or a limit that resets later than that, still stops the run. The retry is preloaded into skillgrade only, so the agent CLI's own API calls are untouched. skillgrade scores a failed rubric call 0 and carries on, so the executor also watches each result as it lands and stops the run at the first rubric error; the agent trial already running finishes on its own.

### Baseline hygiene

The baseline must not see the skill any other way. `prepare.ts` refuses to run when a personal `beeq` skill exists in `~/.agents/skills`, `~/.copilot/skills`, or `~/.claude/skills`. The agent wrapper runs Copilot with `--no-custom-instructions` and the user's MCP servers disabled, Claude with `--strict-mcp-config`, and Codex with a throwaway `CODEX_HOME` that holds only a link to the user's `auth.json`, so Codex config, MCP servers, memories, `AGENTS.md`, plugins, and hooks stay out. Other personal skills stay visible to Copilot and Claude in both variants: they affect both alike, but they make runs from different machines less comparable.

### Rerunning for less

Every trial report keeps the agent's output, and that output lists every file the grader reads, so a rerun can replay saved runs instead of running the agent:

```bash
pnpm exec nx run beeq-skills:eval --regrade=36 --grader=all   # no agent: both variants of iteration-36 through the current graders
pnpm exec nx run beeq-skills:eval --reuseBaseline=36          # the agent runs with-skill only; the baseline replays iteration-36
pnpm exec nx run beeq-skills:eval --concurrent                # both variants at once
```

- Saved runs live in `tmp/skill-evals/`, which git ignores, so replays work only on the machine that ran iteration N. A fresh clone starts with a full run.
- `--regrade=N` fits a change to a grader, the rubric, a task's `expected`, or the API index. It costs only the judge's calls, and none with `--grader=deterministic`. It cannot show a change in agent behaviour, so a skill change needs the agent.
- `--reuseBaseline=N` fits a skill change: the baseline never sees the skill, so its runs stay valid while the prompts, fixtures, agent, and model stay the same. It halves the agent requests, not the wall time: the with-skill runs take as long as they do in a `--concurrent` full run. Pass the same `--model` to both runs, since the CLI's default model changes without notice. The replayed baseline is rescored by this run's graders, so also pass iteration N's `--grader`, `--graderProvider`, and `--graderModel` to keep the result comparable with it.
- A replay reruns every trial iteration N saved for each selected task, whatever `--trials` says. Before any agent or judge call, it fails when a selected task has no saved run in iteration N or its prompt changed, and a reuse also fails when iteration N ran another agent or model. `benchmark.json` records a hash of each task's prompt and workspace files under `metadata.inputs` (and the replayed iterations under `metadata.replayed`), and a replay fails when those hashes changed. Iterations from before the hashes only get the prompt check, with a warning. The fixtures pin the BEEQ version, so a version bump retires every saved run.
- `--concurrent` runs one skillgrade process per variant and prefixes each output line with its variant. It about halves the wall time and doubles the agent requests in flight, so rate limits arrive sooner. A failure in either variant stops both. With `--reuseBaseline` it saves only the few minutes the baseline replay takes.

### Recorded baseline

Full-suite runs with Copilot CLI's default model, 1 trial per task. The last row is the reference: it is the only one with the current skill and the current graders, so compare later runs with it. The first three rows used the skill as of `1ed7522b`, the fourth as of `79680fb6`. The third regrades the second's agent runs (`--regrade`) after the graders changed: the rubric scores blind, the API check rejects prop values a prop does not accept, and four more tasks check the stylesheet import. The fifth reruns only the with-skill variant after the event-name fix in `SKILL.md` and `frameworks.md`; its baseline replays the fourth row's runs through the same graders (`--reuseBaseline`). Compare runs only when they use the same graders, rubric, and grader model.

The with-skill and baseline columns are each variant's mean reward over all its trials, on the 0–1 scale from [Grading](#grading), with the standard deviation across trials. **Delta** is with-skill minus baseline: how many points the skill adds to an average trial, so the reference row's +0.28 means a trial scores 0.28 higher with the skill. A delta near 0 means the skill made no measurable difference. The pass rate is the share of trials that scored at least 0.5.

| Run | Graders | with-skill | baseline | delta | Pass rate (reward ≥ 0.5) |
|---|---|---|---|---|---|
| 2026-09-28, `f8da1aef` | deterministic | 0.99 (sd 0.04) | 0.69 (sd 0.20) | +0.30 | 1.00 vs 0.87 |
| 2026-09-29, `15016f0d` | deterministic + rubric (OpenAI `gpt-4.1-mini`) | 0.96 (sd 0.08) | 0.76 (sd 0.18) | +0.21 | 1.00 vs 0.93 |
| 2026-09-29, `15016f0d` runs regraded at `e14478cc` | deterministic + blind rubric (OpenAI `gpt-4.1`) | 0.95 (sd 0.10) | 0.77 (sd 0.16) | +0.18 | 1.00 vs 0.93 |
| 2026-09-29, `e14478cc` | deterministic + blind rubric (OpenAI `gpt-4.1`) | 0.98 (sd 0.04) | 0.70 (sd 0.17) | +0.28 | 1.00 vs 0.80 |
| 2026-09-30, with-skill after the event-name fix; baseline replayed from the row above | deterministic + blind rubric (OpenAI `gpt-4.1`) | 0.97 (sd 0.05) | 0.70 (sd 0.16) | +0.28 | 1.00 vs 0.87 |

The last row is `pnpm exec nx run beeq-skills:eval --reuseBaseline=42 --grader=all --graderProvider=openai --graderModel=gpt-4.1`, where iteration-42 is the fourth row's run. Without saved runs, the full-run equivalent is the same command with `--concurrent` in place of `--reuseBaseline=42`. Its tasks, where each delta comes from one trial per variant and so moves more between runs than the run's delta:

| Task | with-skill | baseline | delta |
|---|---|---|---|
| `angular-select` | 1.00 | 1.00 | +0.00 |
| `brand-button-override` | 1.00 | 0.80 | +0.20 |
| `destructive-confirm` | 1.00 | 0.64 | +0.36 |
| `details-panel-drawer` | 0.86 | 0.56 | +0.30 |
| `endava-theme-dark` | 1.00 | 0.72 | +0.28 |
| `html-contact-form` | 1.00 | 0.86 | +0.14 |
| `icon-only-toolbar` | 1.00 | 0.70 | +0.30 |
| `next-dialog` | 0.90 | 0.41 | +0.49 |
| `react-settings-form` | 1.00 | 0.86 | +0.14 |
| `row-actions-dropdown` | 1.00 | 0.85 | +0.14 |
| `save-error-alert` | 1.00 | 0.65 | +0.35 |
| `side-menu-navigation` | 0.93 | 0.74 | +0.18 |
| `spa-link-routing` | 1.00 | 0.53 | +0.47 |
| `tooltip-truncation` | 0.88 | 0.63 | +0.24 |
| `vue-list-states` | 1.00 | 0.49 | +0.51 |

`angular-select` scores 1.00 in both variants in every run, so it catches regressions but does not show the skill's effect. With 1 trial, a task's baseline score is a sample: `spa-link-routing` and `destructive-confirm` scored 1.00 in the earlier runs, and here the baseline bound a native `onClick` on breadcrumb items in one and hard-coded colours, sizes, and made-up tokens in the other. The judge adds its own noise: rescoring the same baseline runs moved single tasks by up to 0.06 (`spa-link-routing` from 0.47 to 0.53) and left the mean at 0.70.

The event-name fix held: `react-settings-form`, which bound `onBqChange` on `BqSelect` in the fourth row, now binds `onBqSelect` and scores 1.00. The with-skill trials lose points in four other tasks that scored 1.00 in the fourth row. The fix touched only event names, so these are one-trial samples rather than regressions, as were the fourth row's misses in `brand-button-override` and `row-actions-dropdown`, which score 1.00 here. `side-menu-navigation` and `tooltip-truncation` left a decorative `BqIcon` without `aria-hidden`. `details-panel-drawer` used a `2px` literal and an `appearance` prop that `bq-badge` does not have. `next-dialog` copied `inline-size: 100% !important` from the `bq-page-title` examples in the docs. The judge called that `!important` documented and scored `next-dialog` and `details-panel-drawer` 1.00: it scored the with-skill tasks 0.99 and the baseline 0.78, against 0.96 and 0.66 from the deterministic grader, so the deterministic checks carry most of the gap.

The `eval` target's `threshold` is 0.9 (`project.json`): 0.05 to 0.09 under the with-skill means, so it fails once the skill loses about a quarter of its lift over the baseline. It was set from Copilot runs, so record a baseline before reading another agent's pass or fail; `--threshold=0` reports without failing. After changing the skill or the tasks, rerun the full suite and update this section and the threshold together.

### Suite layout

The executor copies `evals/` to a temp folder outside the repo, fills `{{evals}}` with that path, and writes one skillgrade `eval.yaml` per variant.

| File | Role |
|---|---|
| `eval.base.yaml` | skillgrade `defaults` (the agent command) and the default `graders`. |
| `tasks/<name>.yaml` | One skillgrade task. `name` must match the file name. |
| `footer.md` | Appended to every instruction; `{{metadata.KEY}}` reads task metadata. |
| `prepare.ts` | Runs first: writes `beeq-index.json` (the API index the grader reads) and one `fixtures/<stack>/` consumer project per stack: a `package.json`, plus an app shell with no BEEQ setup for React and Angular. Tasks copy the whole folder, and the grader ignores fixture files the agent left untouched. |
| `solutions/<name>.sh` | Reference answer for `eval-validate`. Writes files, then `rm -- "$0"` so the grader sees only the answer. |
| `agents/run.ts` | Runs Copilot, Claude, or Codex in the workspace and prints the reply plus every file written. It reads the prompt from `prompts/instruction.md`, which the executor adds to every workspace because skillgrade passes prompts through one shared `/tmp/.prompt.md` that concurrent variants overwrite. With `SKILL_EVAL_REPLAY` set, it replays a saved run instead: it writes back the files that run printed and prints its output. |
| `graders/grade.ts`, `lib/*.ts` | The deterministic grader and the BEEQ API index and rules it uses. |

The `.ts` files run under Node's type stripping with no build step, so they use erasable syntax only and import siblings with `.ts` extensions. `nx run beeq-skills:typecheck` enforces both.

### Adding a task

1. Copy a task in `tasks/`. Set `metadata.stack` (`html`, `react`, `next`, `angular`, `vue`) and `metadata.tags`; add `smoke` only to keep the smoke set small and fast.
2. Write `instruction` as a consumer would ask, without naming the rule under test.
3. Put grading data in `expected`, which only graders see: `criteria` for the rubric, `checks` (`match` and `absent` regexes, optional `flags`), `allow_rules` for rule ids the task may break, and `allow_api` for `kind:name` API issues.
4. For smoke tasks, add `solutions/<name>.sh` and run `nx run beeq-skills:eval-validate`.
5. Run `nx run beeq-skills:test`; it checks every task parses and every regex compiles.

**Leakage.** The agent never sees `expected`, the grader, or the rubric: skillgrade keeps `expected` out of the prompt, and the agent wrapper moves `tests/`, `prompts/`, and `environment/` out of the workspace while the agent runs. An agent that goes looking outside its workspace could still find the temp suite copy; review transcripts when a score looks too good.
