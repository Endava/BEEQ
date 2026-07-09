import { logger } from '@nx/devkit';
import { createSpinner, type Spinner } from 'nanospinner';

const PREFIX = '[icons]';

export interface IconsLogger {
  start(text: string): void;
  success(text?: string): void;
  warn(text: string): void;
  fail(text: string): void;
  stop(): void;
}

const isInteractive = (): boolean => Boolean(process.stdout.isTTY) && process.env.CI !== 'true';

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

class PlainLogger implements IconsLogger {
  start(text: string): void {
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

export const createIconsLogger = (): IconsLogger => (isInteractive() ? new SpinnerLogger() : new PlainLogger());
