import { logger } from '@nx/devkit';
import { createSpinner, type Spinner } from 'nanospinner';

/** Prefix printed in front of every log line so `[icons]` groups are easy to grep. */
const PREFIX = '[icons]';

/**
 * Uniform logging surface used by the executor. Two implementations back it:
 * - {@link SpinnerLogger} for interactive TTY sessions (animated progress).
 * - {@link PlainLogger} for CI / non-TTY (Nx `logger` only, no ANSI).
 *
 * Callers should always drive it as a small state machine:
 * `start(...)` → 0..N of `info/success/warn/fail` → `stop()` in a `finally`.
 */
type IconsLogger = {
  /** Begin a new phase. Spinner impl updates the running spinner in place. */
  start(text: string): void;
  /** Emit an out-of-band informational line without disturbing the spinner. */
  info(text: string): void;
  /** Mark the current phase as succeeded. Text defaults to the last `start` message. */
  success(text?: string): void;
  /** Emit a warning; ends the current spinner if one is running. */
  warn(text: string): void;
  /** Emit a failure; ends the current spinner if one is running. */
  fail(text: string): void;
  /** Idempotent teardown. Always call in a `finally` to guarantee no dangling spinner. */
  stop(): void;
};

/**
 * Detect an interactive TTY that is not running under CI.
 *
 * @returns `true` when stdout is a TTY and `CI` is not `'true'`.
 */
const isInteractive = (): boolean => Boolean(process.stdout.isTTY) && process.env.CI !== 'true';

/**
 * TTY implementation backed by `nanospinner`. Maintains a single spinner
 * that is reused across `start()` calls; `info()` briefly clears it so
 * one-off notices don't get overwritten by the animated frame.
 */
class SpinnerLogger implements IconsLogger {
  private spinner: Spinner | null = null;
  private currentText = '';

  start(text: string): void {
    this.currentText = text;
    if (this.spinner) {
      this.spinner.update({ text });
      return;
    }
    this.spinner = createSpinner(text).start();
  }

  info(text: string): void {
    if (this.spinner) {
      this.spinner.clear();
    }
    logger.info(`${PREFIX} ℹ ${text}`);
    if (this.spinner) {
      this.spinner.start();
    }
  }

  success(text?: string): void {
    const message = text ?? this.currentText;
    if (this.spinner) {
      this.spinner.success({ text: message });
      this.spinner = null;
      return;
    }
    logger.info(`${PREFIX} ✔ ${message}`);
  }

  warn(text: string): void {
    if (this.spinner) {
      this.spinner.warn({ text });
      this.spinner = null;
    } else {
      logger.warn(`${PREFIX} ${text}`);
    }
  }

  fail(text: string): void {
    if (this.spinner) {
      this.spinner.error({ text });
      this.spinner = null;
      return;
    }
    logger.error(`${PREFIX} ${text}`);
  }

  stop(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }
}

/**
 * Non-TTY implementation. Every message is forwarded to Nx's `logger` so
 * CI output stays line-oriented and greppable. `success()` without a text
 * arg is a no-op (spinners give it meaning but CI does not).
 */
class PlainLogger implements IconsLogger {
  start(text: string): void {
    logger.info(`${PREFIX} ${text}`);
  }
  info(text: string): void {
    logger.info(`${PREFIX} ${text}`);
  }
  success(text?: string): void {
    if (text) logger.info(`${PREFIX} ✔ ${text}`);
  }
  warn(text: string): void {
    logger.warn(`${PREFIX} ${text}`);
  }
  fail(text: string): void {
    logger.error(`${PREFIX} ${text}`);
  }
  stop(): void {
    /* no-op */
  }
}

/**
 * Pick the right {@link IconsLogger} for the current environment
 * (spinner in an interactive TTY, plain otherwise).
 *
 * @returns A fresh {@link IconsLogger} instance.
 */
const createIconsLogger = (): IconsLogger => (isInteractive() ? new SpinnerLogger() : new PlainLogger());

export type { IconsLogger };
export { createIconsLogger };
