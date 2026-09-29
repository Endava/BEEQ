// Helpers for the consumer projects the eval agent works in.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

/** Framework dependencies a fresh consumer project would declare, per stack. Nothing is installed. */
const STACK_DEPENDENCIES: Record<string, Record<string, string>> = {
  html: { vite: '^7.0.0' },
  react: { '@beeq/react': 'beeq', react: '^19.0.0', 'react-dom': '^19.0.0' },
  next: { '@beeq/react': 'beeq', next: '^15.0.0', react: '^19.0.0', 'react-dom': '^19.0.0' },
  angular: {
    '@beeq/angular': 'beeq',
    '@angular/core': '^20.0.0',
    '@angular/forms': '^20.0.0',
    '@angular/platform-browser': '^20.0.0',
  },
  vue: { '@beeq/vue': 'beeq', vue: '^3.5.0' },
};

export const STACKS = Object.keys(STACK_DEPENDENCIES);

/** Starter files a consumer app on the stack already has before anyone sets BEEQ up. */
const APP_SHELLS: Record<string, Record<string, string>> = {
  react: {
    'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    'src/main.tsx': `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
    'src/App.tsx': `export function App() {
  return <main />;
}
`,
    'src/index.css': `body {
  margin: 0;
}
`,
  },
  angular: {
    'angular.json': `${JSON.stringify(
      {
        version: 1,
        projects: {
          app: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            architect: {
              build: {
                builder: '@angular/build:application',
                options: { browser: 'src/main.ts', index: 'src/index.html', styles: ['src/styles.css'] },
              },
            },
          },
        },
      },
      null,
      2,
    )}\n`,
    'src/index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>App</title>
    <base href="/" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`,
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';

bootstrapApplication(App).catch((error) => console.error(error));
`,
    'src/app/app.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<main></main>',
})
export class App {}
`,
    'src/styles.css': `body {
  margin: 0;
}
`,
  },
};

/** Folder the suite's `prepare.ts` writes one fixture per stack into. */
export const FIXTURES_DIR = path.join(import.meta.dirname, '..', 'fixtures');

/** Every file of the consumer project on `stack`, keyed by relative path. */
export function fixtureFiles(stack: string, beeqVersion: string): Record<string, string> {
  return { 'package.json': packageJson(stack, beeqVersion), ...APP_SHELLS[stack] };
}

/** The `package.json` of a consumer project on `stack`, pinned to `beeqVersion` for every BEEQ package. */
export function packageJson(stack: string, beeqVersion: string) {
  const framework = STACK_DEPENDENCIES[stack];
  if (!framework) throw new Error(`Unknown stack "${stack}". Use one of: ${STACKS.join(', ')}.`);
  const dependencies = Object.fromEntries(
    Object.entries({ '@beeq/core': 'beeq', ...framework }).map(([name, range]) => [
      name,
      range === 'beeq' ? beeqVersion : range,
    ]),
  );
  const manifest = { name: `beeq-eval-${stack}`, private: true, type: 'module', dependencies };
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

const PERSONAL_SKILL_DIRS = ['.agents/skills', '.copilot/skills', '.claude/skills'];

/** Throws when a personal `beeq` skill would leak into a baseline run that must not see it. */
export function assertNoPersonalSkill(home = homedir()) {
  for (const dir of PERSONAL_SKILL_DIRS) {
    const skill = path.join(home, dir, 'beeq');
    if (existsSync(skill)) {
      throw new Error(
        `A personal BEEQ skill at ${skill} would contaminate the baseline. Move it aside while evaluating.`,
      );
    }
  }
}

/** Workspace entries that are not the agent's work: installed skills, skillgrade's files, and the fixture. */
export const IGNORED_ENTRIES = new Set<string>([
  '.agents',
  '.claude',
  '.git',
  '.github',
  'environment',
  'node_modules',
  'package-lock.json',
  'package.json',
  'prompts',
  'tests',
]);

export type WorkspaceFile = { path: string; lang: string; content: string };

/** True when `file` is a fixture file the agent left as it was. */
function isUntouchedFixture(relative: string, content: string, fixturesDir: string) {
  if (!existsSync(fixturesDir)) return false;
  return readdirSync(fixturesDir).some((stack) => {
    const fixture = path.join(fixturesDir, stack, relative);
    return existsSync(fixture) && statSync(fixture).isFile() && readFileSync(fixture, 'utf8') === content;
  });
}

/** Every file the agent wrote or changed, sorted by path, with the language taken from the extension. */
export function collectFiles(dir: string, fixturesDir = FIXTURES_DIR) {
  const files: WorkspaceFile[] = [];
  const walk = (current: string) => {
    for (const entry of readdirSync(current).sort((a, b) => a.localeCompare(b, 'en'))) {
      if (current === dir && IGNORED_ENTRIES.has(entry)) continue;
      if (entry === 'node_modules') continue;
      const file = path.join(current, entry);
      if (statSync(file).isDirectory()) walk(file);
      else {
        const relative = path.relative(dir, file);
        const content = readFileSync(file, 'utf8');
        if (isUntouchedFixture(relative, content, fixturesDir)) continue;
        files.push({ path: relative, lang: path.extname(entry).slice(1), content });
      }
    }
  };
  walk(dir);
  return files;
}

/** Files as fenced blocks whose info string is the language and path, as the grader and rubric expect. */
export const formatFiles = (files: WorkspaceFile[]) =>
  files.map((file) => `\`\`\`${file.lang} ${file.path}\n${file.content.trimEnd()}\n\`\`\``).join('\n\n');

/**
 * Reads back the files `formatFiles` printed. A block ends at a closing fence followed by the next block or the
 * end of the text, so fences inside a file's content stay part of it.
 */
export const parseFiles = (text: string): Omit<WorkspaceFile, 'lang'>[] =>
  [...text.matchAll(/^```\S* ([^\n]+)\n([\s\S]*?)\n```(?=\n\n```\S* [^\n]+\n|\s*(?![\s\S]))/gm)].map(
    ([, file, content]) => ({ path: file, content }),
  );
