import { setTimeout as sleep } from 'node:timers/promises';

/** Statuses of a limit or an overload that passes: rate limits, server errors, and Anthropic's 529. */
const RETRYABLE = new Set([429, 500, 502, 503, 504, 529]);
const BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30_000;
/** Added to every wait, so the retry lands after the limit resets rather than on it. */
const MARGIN_MS = 250;
/** skillgrade stops a grader after 120 s; retries stop waiting in time for a last call to answer. */
const MAX_WAIT_MS = 90_000;

const UNIT_MS: Record<string, number> = { h: 3_600_000, m: 60_000, s: 1000, ms: 1 };

/** Milliseconds in an OpenAI "Please try again in 1m2.5s" (or "in 120ms") message. */
function tryAgainIn(body: string) {
  const match = /try again in ((?:\d+(?:\.\d+)?(?:ms|h|m|s))+)/i.exec(body);
  if (!match) return undefined;
  let total = 0;
  for (const [, value, unit] of match[1].matchAll(/(\d+(?:\.\d+)?)(ms|h|m|s)/g)) total += Number(value) * UNIT_MS[unit];
  return total;
}

/** The wait a response asks for in `retry-after-ms`, or `retry-after` in seconds or as a date. */
function retryAfter(headers: Headers) {
  const ms = Number(headers.get('retry-after-ms'));
  if (ms > 0) return ms;
  const after = headers.get('retry-after');
  if (!after) return undefined;
  const seconds = Number(after);
  if (!Number.isNaN(seconds)) return seconds * 1000;
  const date = Date.parse(after);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

/**
 * Milliseconds to wait before retrying a judge response, or undefined when a retry cannot help: a success,
 * a request error, or a 429 for a spent quota rather than a rate. Takes the wait the API asks for, else backs
 * off exponentially from 1 s by `attempt`.
 */
export function retryDelay(status: number, headers: Headers, body: string, attempt: number) {
  if (!RETRYABLE.has(status) || body.includes('insufficient_quota')) return undefined;
  const asked = retryAfter(headers) ?? tryAgainIn(body);
  return (asked ?? Math.min(BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS)) + MARGIN_MS;
}

/** Calls retried, and the time calls were held, overlapping waits counted once. */
export type RetryStats = { retries: number; pausedMs: number };

export const retrySummary = ({ retries, pausedMs }: RetryStats) =>
  `LLM rubric: ${retries} judge ${retries === 1 ? 'call' : 'calls'} hit a rate limit or overload and ` +
  `${retries === 1 ? 'was' : 'were'} retried, after ${(pausedMs / 1000).toFixed(1)} s of waiting.`;

/** A request `fetch` can send again: skillgrade's, with a string body or none. */
const resendable = (input: Parameters<typeof fetch>[0], init?: RequestInit) =>
  !(input instanceof Request) && (init?.body == null || typeof init.body === 'string');

/**
 * Wraps `fetch` so a judge call that hits a rate limit or overload waits and retries instead of failing the
 * run. A wait holds every call through the wrapper. A call gets the last response once waiting again would
 * pass `maxWaitMs`, so a daily limit or a spent quota still fails fast. A request it cannot resend passes
 * straight through.
 */
export function retryingFetch(
  inner: typeof fetch,
  { maxWaitMs = MAX_WAIT_MS, stats = { retries: 0, pausedMs: 0 } as RetryStats } = {},
): typeof fetch {
  let resumeAt = 0;
  const pause = (delay: number) => {
    const now = Date.now();
    stats.pausedMs += Math.max(0, now + delay - Math.max(resumeAt, now));
    resumeAt = Math.max(resumeAt, now + delay);
  };
  const hold = async (deadline: number) => {
    const held = Math.min(resumeAt, deadline) - Date.now();
    if (held > 0) await sleep(held);
  };

  return async (input, init) => {
    if (!resendable(input, init)) return inner(input, init);
    const deadline = Date.now() + maxWaitMs;
    for (let attempt = 0; ; attempt++) {
      await hold(deadline);
      const response = await inner(input, init);
      if (!RETRYABLE.has(response.status)) return response;
      const delay = retryDelay(response.status, response.headers, await response.clone().text(), attempt);
      if (delay === undefined || Date.now() + delay > deadline) return response;
      await response.body?.cancel();
      pause(delay);
      stats.retries++;
    }
  };
}

/** Runs `task` with the global `fetch` retrying judge calls, for code that calls skillgrade in this process. */
export async function withJudgeRetries<T>(task: () => Promise<T>) {
  const original = globalThis.fetch;
  globalThis.fetch = retryingFetch(original);
  try {
    return await task();
  } finally {
    globalThis.fetch = original;
  }
}
