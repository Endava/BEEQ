import { execFile } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { type RetryStats, retryDelay, retryingFetch, retrySummary, withJudgeRetries } from '../lib/index.ts';

const JUDGE_URL = 'https://judge.test/v1/chat/completions';
const INIT = { method: 'POST', body: '{"model":"test"}' };

const limited = (headers: Record<string, string> = {}, body = '{"error":{"type":"tokens"}}') =>
  new Response(body, { status: 429, headers });
const ok = () => new Response('{"choices":[]}', { status: 200 });

describe('retryDelay', () => {
  it('should wait what the response asks for, plus a margin', () => {
    // Arrange
    const openai = 'Rate limit reached for gpt-4.1 on tokens per min (TPM). Please try again in 2.772s. Visit';

    // Act & Assert
    expect(retryDelay(429, new Headers({ 'retry-after-ms': '1500', 'retry-after': '9' }), '', 0)).toBe(1750);
    expect(retryDelay(429, new Headers({ 'retry-after': '3' }), '', 0)).toBe(3250);
    expect(retryDelay(429, new Headers(), openai, 0)).toBe(3022);
    expect(retryDelay(429, new Headers(), 'Please try again in 1m30s.', 0)).toBe(90_250);
    expect(retryDelay(429, new Headers(), 'Please try again in 120ms.', 0)).toBe(370);
  });

  it('should back off exponentially when the response gives no wait', () => {
    // Act & Assert
    expect(retryDelay(503, new Headers(), '', 0)).toBe(1250);
    expect(retryDelay(529, new Headers(), 'overloaded', 2)).toBe(4250);
    expect(retryDelay(500, new Headers(), '', 10)).toBe(30_250);
  });

  it('should not retry a success, a request error, or a spent quota', () => {
    // Act & Assert
    expect(retryDelay(200, new Headers(), '', 0)).toBeUndefined();
    expect(retryDelay(401, new Headers({ 'retry-after': '1' }), '', 0)).toBeUndefined();
    expect(retryDelay(429, new Headers(), '{"error":{"code":"insufficient_quota"}}', 0)).toBeUndefined();
  });
});

describe('retryingFetch', () => {
  it('should retry a rate limit and count the retry', async () => {
    // Arrange
    const inner = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(limited({ 'retry-after-ms': '1' }))
      .mockResolvedValue(ok());
    const stats: RetryStats = { retries: 0, pausedMs: 0 };

    // Act
    const response = await retryingFetch(inner, { stats })(JUDGE_URL, INIT);

    // Assert
    expect(response.status).toBe(200);
    expect(inner).toHaveBeenCalledTimes(2);
    expect(inner).toHaveBeenLastCalledWith(JUDGE_URL, INIT);
    expect(stats).toEqual({ retries: 1, pausedMs: expect.any(Number) });
    expect(stats.pausedMs).toBeGreaterThanOrEqual(250);
  });

  it('should return the response, still readable, when a retry cannot help or would wait too long', async () => {
    // Arrange
    const quota = vi.fn<typeof fetch>().mockResolvedValue(limited({}, '{"error":{"code":"insufficient_quota"}}'));
    const daily = vi.fn<typeof fetch>().mockResolvedValue(limited({ 'retry-after': '3600' }));

    // Act
    const spent = await retryingFetch(quota)(JUDGE_URL, INIT);
    const tomorrow = await retryingFetch(daily, { maxWaitMs: 1000 })(JUDGE_URL, INIT);

    // Assert
    expect(await spent.text()).toContain('insufficient_quota');
    expect(tomorrow.status).toBe(429);
    expect(quota).toHaveBeenCalledTimes(1);
    expect(daily).toHaveBeenCalledTimes(1);
  });

  it('should hold every call while one waits for the limit', async () => {
    // Arrange
    const calls: number[] = [];
    const inner = vi.fn<typeof fetch>(async () => {
      calls.push(Date.now());
      return calls.length === 1 ? limited({ 'retry-after-ms': '10' }) : ok();
    });
    const judge = retryingFetch(inner);

    // Act
    const first = judge(JUDGE_URL, INIT);
    await new Promise((resolve) => setTimeout(resolve, 50));
    const second = judge(JUDGE_URL, INIT);
    await Promise.all([first, second]);

    // Assert
    expect(calls).toHaveLength(3);
    for (const call of calls.slice(1)) expect(call - calls[0]).toBeGreaterThanOrEqual(250);
  });

  it('should pass through a request it cannot resend', async () => {
    // Arrange
    const inner = vi.fn<typeof fetch>().mockResolvedValue(limited({ 'retry-after-ms': '1' }));

    // Act
    const response = await retryingFetch(inner)(JUDGE_URL, { method: 'POST', body: new Uint8Array([1]) });

    // Assert
    expect(response.status).toBe(429);
    expect(inner).toHaveBeenCalledTimes(1);
  });
});

describe('withJudgeRetries', () => {
  const original = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = original;
  });

  it('should retry the global fetch inside the task and restore it after', async () => {
    // Arrange
    const stub = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(limited({ 'retry-after-ms': '1' }))
      .mockResolvedValue(ok());
    globalThis.fetch = stub;

    // Act
    const status = await withJudgeRetries(async () => (await fetch(JUDGE_URL, INIT)).status);

    // Assert
    expect(status).toBe(200);
    expect(stub).toHaveBeenCalledTimes(2);
    expect(globalThis.fetch).toBe(stub);
  });
});

describe('retrySummary', () => {
  it('should say how many calls were retried and how long they waited', () => {
    // Act & Assert
    expect(retrySummary({ retries: 1, pausedMs: 2600 })).toBe(
      'LLM rubric: 1 judge call hit a rate limit or overload and was retried, after 2.6 s of waiting.',
    );
    expect(retrySummary({ retries: 4, pausedMs: 12_400 })).toContain(
      '4 judge calls hit a rate limit or overload and were',
    );
  });
});

describe('judge-retry-hook', () => {
  it('should make a preloaded Node process retry rate limits and report them on exit', async () => {
    // Arrange
    let requests = 0;
    const server = createServer((_request, response) => {
      requests++;
      response.writeHead(requests === 1 ? 429 : 200, { 'retry-after-ms': '1' });
      response.end(requests === 1 ? 'slow down' : 'scored');
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1/chat/completions`;
    const dir = mkdtempSync(path.join(tmpdir(), 'judge-retry-'));
    const script = path.join(dir, 'judge.mjs');
    writeFileSync(
      script,
      `const r = await fetch(${JSON.stringify(url)}, { method: 'POST', body: '{}' });\n` +
        "process.stdout.write(r.status + ' ' + (await r.text()) + '\\n');",
    );
    const hook = fileURLToPath(new URL('../lib/judge-retry-hook.ts', import.meta.url));

    try {
      // Act
      const { stdout } = await promisify(execFile)(process.execPath, ['--import', hook, script]);

      // Assert
      expect(stdout).toBe(
        '200 scored\nLLM rubric: 1 judge call hit a rate limit or overload and was retried, after 0.3 s of waiting.\n',
      );
      expect(requests).toBe(2);
    } finally {
      await new Promise((resolve) => server.close(resolve));
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
