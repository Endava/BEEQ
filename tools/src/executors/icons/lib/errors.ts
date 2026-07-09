export type IconsPhase = 'options' | 'download' | 'checksum' | 'extract' | 'metadata' | 'cache' | 'cleanup';

export interface IconsExecutorErrorOptions {
  cause?: unknown;
  context?: Record<string, unknown>;
}

export class IconsExecutorError extends Error {
  readonly phase: IconsPhase;
  readonly context?: Record<string, unknown>;

  constructor(phase: IconsPhase, message: string, options: IconsExecutorErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = 'IconsExecutorError';
    this.phase = phase;
    this.context = options.context;
  }
}

export const asIconsError = (
  phase: IconsPhase,
  message: string,
  cause: unknown,
  context?: Record<string, unknown>,
): IconsExecutorError => {
  if (cause instanceof IconsExecutorError) return cause;
  const causeMessage = cause instanceof Error ? cause.message : String(cause);
  return new IconsExecutorError(phase, `${message}: ${causeMessage}`, { cause, context });
};
