#!/usr/bin/env node
// skillgrade `command` agent: reads the task prompt on stdin and runs a coding-agent CLI in the workspace.
// Usage: node run.ts <copilot|claude> [--model <id>]
//
// skillgrade puts its grader script and rubric in the workspace (tests/, prompts/, environment/). They are
// moved out while the agent runs, so it cannot read what it is graded on, and restored for the graders.
// The reply is printed with every file the agent wrote, because the LLM rubric only sees this output.
import { execFile } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

import { collectFiles, formatFiles } from '../lib/workspace.ts';

type AgentCommand = (input: { prompt: string; model?: string }) => [command: string, args: string[]];

const HIDDEN = ['tests', 'prompts', 'environment'];

/** The user's Copilot MCP servers, disabled so a docs server cannot stand in for the skill. */
function copilotMcpServers(): string[] {
  const file = path.join(homedir(), '.copilot/mcp-config.json');
  if (!existsSync(file)) return [];
  return Object.keys(JSON.parse(readFileSync(file, 'utf8')).mcpServers ?? {});
}

export const COMMANDS: Record<string, AgentCommand> = {
  copilot: ({ prompt, model }) => [
    'copilot',
    [
      '-p',
      prompt,
      '-s',
      '--no-custom-instructions',
      '--allow-all-tools',
      ...copilotMcpServers().flatMap((name) => ['--disable-mcp-server', name]),
      ...(model ? ['--model', model] : []),
    ],
  ],
  claude: ({ prompt, model }) => [
    'claude',
    [
      '-p',
      prompt,
      '--output-format',
      'text',
      '--strict-mcp-config',
      '--permission-mode',
      'acceptEdits',
      ...(model ? ['--model', model] : []),
    ],
  ],
};

/** Writes fenced blocks whose info string names a file (```tsx src/App.tsx) into `dir`. */
export function materializeBlocks(reply: string, dir: string) {
  const written: string[] = [];
  for (const [, file, code] of reply.matchAll(/```[\w-]*[ \t]+([\w./-]+\.\w+)[^\n]*\n([\s\S]*?)```/g)) {
    const target = path.resolve(dir, file);
    if (!target.startsWith(dir + path.sep)) continue;
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, code);
    written.push(file);
  }
  return written;
}

const readStdin = async () => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
};

type RunResult = { code: number; stdout: string; stderr: string; error: Error | null };

const run = (command: string, args: string[], cwd: string) =>
  new Promise<RunResult>((resolve) => {
    execFile(command, args, { cwd, maxBuffer: 64 * 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({ code: error ? (typeof error.code === 'number' ? error.code : 1) : 0, stdout, stderr, error });
    });
  });

async function main() {
  const { positionals, values } = parseArgs({ allowPositionals: true, options: { model: { type: 'string' } } });
  const [agent] = positionals;
  if (!COMMANDS[agent]) throw new Error(`Unknown agent "${agent}". Use ${Object.keys(COMMANDS).join(' or ')}.`);

  const workspace = process.cwd();
  const prompt = await readStdin();
  const stash = mkdtempSync(path.join(tmpdir(), 'beeq-eval-stash-'));
  const hidden = HIDDEN.filter((entry) => existsSync(path.join(workspace, entry)));

  let result: RunResult;
  try {
    for (const entry of hidden) renameSync(path.join(workspace, entry), path.join(stash, entry));
    const [command, args] = COMMANDS[agent]({ prompt, model: values.model });
    result = await run(command, args, workspace);
  } finally {
    for (const entry of hidden) renameSync(path.join(stash, entry), path.join(workspace, entry));
    rmSync(stash, { recursive: true, force: true });
  }

  const reply = result.stdout.trim();
  if (collectFiles(workspace).length === 0) materializeBlocks(reply, workspace);

  const files = collectFiles(workspace);
  console.log(reply || '(no reply)');
  console.log(`\n## Files written (${files.length})\n`);
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
