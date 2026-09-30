// Preloaded into each skillgrade process with `node --import`, so skillgrade's judge calls retry rate limits.
// The agent runs as a shell command, which does not inherit `--import`, so its own API calls are untouched.
import { writeSync } from 'node:fs';

import { type RetryStats, retryingFetch, retrySummary } from './judge-retry.ts';

const stats: RetryStats = { retries: 0, pausedMs: 0 };
globalThis.fetch = retryingFetch(globalThis.fetch, { stats });

process.on('exit', () => {
  if (!stats.retries) return;
  try {
    // An exit handler cannot wait for an asynchronous stdout write to finish.
    writeSync(process.stdout.fd, `${retrySummary(stats)}\n`);
  } catch {
    // A full or closed stdout only loses the summary.
  }
});
