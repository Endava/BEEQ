#!/usr/bin/env node
// skillgrade `command` agent: reads the task prompt and runs a coding-agent CLI in the workspace.
// Usage: node run.ts <copilot|claude|codex> [--model <id>]
//
// The prompt comes from prompts/instruction.md, which the executor copies into every workspace, or else from
// stdin. skillgrade puts its grader script and rubric in the workspace too (tests/, prompts/, environment/).
// They are moved out while the agent runs, so it cannot read what it is graded on, and restored for the
// graders. The reply is printed with every file the agent wrote, because the LLM rubric only sees this output.
//
// With SKILL_EVAL_REPLAY set, no agent runs: the next saved run for the prompt is replayed instead, its files
// written back to the workspace and its output printed as it was, so the current graders can regrade it.
import { type ExecFileException, execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

import { collectFiles, formatFiles, parseFiles } from '../lib/workspace.ts';

/** `home` is an empty folder, removed after the run, for agents that need a throwaway config home. */
type AgentInput = { prompt: string; model?: string; home: string };
type AgentRun = { command: string; args: string[]; env?: Record<string, string>; stdin?: string };
type AgentCommand = (input: AgentInput) => AgentRun;

const HIDDEN = ['tests', 'prompts', 'environment'];
const PROMPT_FILE = 'prompts/instruction.md';
/** Heading between the reply and the files the agent wrote. */
const FILES_HEADING = '\n## Files written (';

/** The user's Copilot MCP servers, disabled so a docs server cannot stand in for the skill. */
function copilotMcpServers(): string[] {
  const file = path.join(homedir(), '.copilot/mcp-config.json');
  if (!existsSync(file)) return [];
  return Object.keys(JSON.parse(readFileSync(file, 'utf8')).mcpServers ?? {});
}

/**
 * Turns `home` into a clean CODEX_HOME, so the user's config, MCP servers, memories, AGENTS.md, plugins, and
 * hooks stay out of the run. `auth.json` is symlinked rather than copied: Codex rewrites it in place when it
 * refreshes a ChatGPT login, and a stale copy would leave the real login with a spent refresh token.
 */
export function codexHome(home: string, env: NodeJS.ProcessEnv = process.env) {
  const auth = path.join(env.CODEX_HOME ?? path.join(homedir(), '.codex'), 'auth.json');
  if (existsSync(auth)) symlinkSync(auth, path.join(home, 'auth.json'));
  else if (!env.CODEX_API_KEY)
    throw new Error(`Codex has no login at ${auth}. Run "codex login" or set CODEX_API_KEY.`);
  return home;
}

export const COMMANDS: Record<string, AgentCommand> = {
  copilot: ({ prompt, model }) => ({
    command: 'copilot',
    args: [
      '-p',
      prompt,
      '-s',
      '--no-custom-instructions',
      '--allow-all-tools',
      ...copilotMcpServers().flatMap((name) => ['--disable-mcp-server', name]),
      ...(model ? ['--model', model] : []),
    ],
  }),
  claude: ({ prompt, model }) => ({
    command: 'claude',
    args: [
      '-p',
      prompt,
      '--output-format',
      'text',
      '--strict-mcp-config',
      '--permission-mode',
      'acceptEdits',
      ...(model ? ['--model', model] : []),
    ],
  }),
  // The prompt goes on stdin (`-`) so a task that opens with a word like "review" is not read as a subcommand.
  // Network access matches the other agents, which can fetch the beeq.design pages the skill verifies against.
  codex: ({ prompt, model, home }) => ({
    command: 'codex',
    args: [
      'exec',
      '--skip-git-repo-check',
      '--sandbox',
      'workspace-write',
      '-c',
      'sandbox_workspace_write.network_access=true',
      '--color',
      'never',
      ...(model ? ['--model', model] : []),
      '-',
    ],
    env: { CODEX_HOME: codexHome(home) },
    stdin: prompt,
  }),
};

/** Writes `content` to `file` inside `dir`; false, writing nothing, when `file` points outside it. */
function writeInside(dir: string, file: string, content: string) {
  const target = path.resolve(dir, file);
  if (!target.startsWith(dir + path.sep)) return false;
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
  return true;
}

/** Writes fenced blocks whose info string names a file (```tsx src/App.tsx) into `dir`. */
export function materializeBlocks(reply: string, dir: string) {
  const written: string[] = [];
  for (const [, file, code] of reply.matchAll(/```[\w-]*[ \t]+([\w./-]+\.\w+)[^\n]*\n([\s\S]*?)```/g)) {
    if (writeInside(dir, file, code)) written.push(file);
  }
  return written;
}

const readStdin = async () => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
};

/** The task prompt: the workspace's prompt file when it has one, stdin otherwise. */
async function readPrompt(workspace: string) {
  const stdin = await readStdin();
  const file = path.join(workspace, PROMPT_FILE);
  return existsSync(file) ? readFileSync(file, 'utf8') : stdin;
}

/** An agent run as the executor saved it for replay. */
export type SavedRun = { stdout: string; stderr: string; exitCode: number };

/**
 * Claims the next unclaimed saved run for `prompt` in `dir`, lowest trial first. The rename is atomic, so
 * trials running in parallel never replay the same run.
 */
export function claimReplay(dir: string, prompt: string): SavedRun {
  const taskDir = path.join(dir, createHash('sha256').update(prompt).digest('hex'));
  const trials = existsSync(taskDir)
    ? readdirSync(taskDir)
        .filter((file) => /^\d+\.json$/.test(file))
        .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10))
    : [];
  for (const file of trials) {
    const claimed = path.join(taskDir, `${file}.claimed`);
    try {
      renameSync(path.join(taskDir, file), claimed);
    } catch {
      continue;
    }
    return JSON.parse(readFileSync(claimed, 'utf8')) as SavedRun;
  }
  throw new Error(`No saved run left to replay for this prompt in ${dir}.`);
}

/** Writes back the files `run` printed and replays its output and exit code. */
export function replay(run: SavedRun, workspace: string) {
  const heading = run.stdout.lastIndexOf(FILES_HEADING);
  const files = heading === -1 ? [] : parseFiles(run.stdout.slice(heading));
  for (const file of files) writeInside(workspace, file.path, `${file.content}\n`);
  process.stdout.write(run.stdout);
  process.stderr.write(run.stderr);
  process.exitCode = run.exitCode;
}

type RunResult = { code: number; stdout: string; stderr: string; error: Error | null };

/** The child's exit code: 0 on success, its numeric code when it exited, 1 when it could not start. */
const exitCode = (error: ExecFileException | null) => {
  if (!error) return 0;
  return typeof error.code === 'number' ? error.code : 1;
};

const run = ({ command, args, env, stdin }: AgentRun, cwd: string) =>
  new Promise<RunResult>((resolve) => {
    const child = execFile(
      command,
      args,
      { cwd, env: { ...process.env, ...env }, maxBuffer: 64 * 1024 * 1024 },
      (error, stdout, stderr) => {
        resolve({ code: exitCode(error), stdout, stderr, error });
      },
    );
    child.stdin?.end(stdin ?? '');
  });

async function main() {
  const { positionals, values } = parseArgs({ allowPositionals: true, options: { model: { type: 'string' } } });
  const [agent] = positionals;
  if (!COMMANDS[agent]) throw new Error(`Unknown agent "${agent}". Use ${Object.keys(COMMANDS).join(', ')}.`);

  const workspace = process.cwd();
  const prompt = await readPrompt(workspace);
  const replayDir = process.env.SKILL_EVAL_REPLAY;
  if (replayDir) {
    replay(claimReplay(replayDir, prompt), workspace);
    return;
  }

  const stash = mkdtempSync(path.join(tmpdir(), 'beeq-eval-stash-'));
  const home = mkdtempSync(path.join(tmpdir(), 'beeq-eval-home-'));
  const hidden = HIDDEN.filter((entry) => existsSync(path.join(workspace, entry)));

  let result: RunResult;
  try {
    for (const entry of hidden) renameSync(path.join(workspace, entry), path.join(stash, entry));
    result = await run(COMMANDS[agent]({ prompt, model: values.model, home }), workspace);
  } finally {
    for (const entry of hidden) renameSync(path.join(stash, entry), path.join(workspace, entry));
    rmSync(stash, { recursive: true, force: true });
    rmSync(home, { recursive: true, force: true });
  }

  const reply = result.stdout.trim();
  if (collectFiles(workspace).length === 0) materializeBlocks(reply, workspace);

  const files = collectFiles(workspace);
  console.log(reply || '(no reply)');
  console.log(`${FILES_HEADING}${files.length})\n`);
  if (files.length) console.log(formatFiles(files));
  if (result.code !== 0) {
    console.error(`${agent} exited with ${result.code}: ${result.stderr.trim() || result.error?.message || ''}`);
  }
  process.exitCode = result.code;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;

if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
