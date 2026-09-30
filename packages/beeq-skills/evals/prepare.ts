#!/usr/bin/env node
// Runs once in the suite's temp copy before any eval, called by the skill-eval executor with:
//   SKILL_EVAL_WORKSPACE_ROOT  the BEEQ repo root
//   SKILL_EVAL_VARIANTS        comma-separated variants whose agent is about to run
// Writes the files graders and tasks read, so nothing at eval time reads the repo.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { loadBeeqIndex, serializeIndex } from './lib/beeq-index.ts';
import { assertNoPersonalSkill, fixtureFiles, STACKS } from './lib/workspace.ts';

const root = process.env.SKILL_EVAL_WORKSPACE_ROOT;
if (!root) throw new Error('SKILL_EVAL_WORKSPACE_ROOT is not set.');

const variants = (process.env.SKILL_EVAL_VARIANTS ?? '').split(',');
if (variants.includes('baseline') && process.env.SKILL_EVAL_VALIDATE !== 'true') assertNoPersonalSkill();

const here = import.meta.dirname;
writeFileSync(path.join(here, 'beeq-index.json'), JSON.stringify(serializeIndex(loadBeeqIndex(root))));

const { version } = JSON.parse(readFileSync(path.join(root, 'packages/beeq/package.json'), 'utf8'));
for (const stack of STACKS) {
  for (const [file, content] of Object.entries(fixtureFiles(stack, version))) {
    const target = path.join(here, 'fixtures', stack, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
}
