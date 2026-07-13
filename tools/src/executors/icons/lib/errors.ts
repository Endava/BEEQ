/**
 * Named phase of the icons executor pipeline. Attached to
 * {@link IconsExecutorError} so callers (and logs) can attribute failures
 * to a specific stage without parsing error messages.
 */
type IconsPhase = 'options' | 'download' | 'checksum' | 'extract' | 'metadata' | 'cache' | 'cleanup';

/**
 * Optional construction inputs for {@link IconsExecutorError}.
 */
type IconsExecutorErrorOptions = {
  /**
   * Underlying error that triggered this one. Preserved on the standard
   * `Error.cause` chain for debugging.
   */
  cause?: unknown;
  /**
   * Free-form key/value bag with additional debug context
   * (e.g. `{ archiveUrl, status }`). Serialized in logs but never mutated
   * by the executor.
   */
  context?: Record<string, unknown>;
};

/**
 * Rich error thrown by every stage of the icons executor. Carries the
 * originating {@link IconsPhase} plus optional context so failure logs
 * consistently look like `[<phase>] <message>`.
 */
class IconsExecutorError extends Error {
  readonly phase: IconsPhase;
  readonly context?: Record<string, unknown>;

  /**
   * @param phase - The pipeline stage that produced the failure.
   * @param message - Human-readable summary safe to print in CI logs.
   * @param options - Optional cause / context; see {@link IconsExecutorErrorOptions}.
   */
  constructor(phase: IconsPhase, message: string, options: IconsExecutorErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = 'IconsExecutorError';
    this.phase = phase;
    this.context = options.context;
  }
}

/**
 * Wrap any thrown value in an {@link IconsExecutorError} tagged with the
 * given `phase`, preserving the original error as the `cause`.
 *
 * When `cause` is already an {@link IconsExecutorError}, it is returned
 * unchanged so the outermost handler still sees the original phase and
 * context (avoids double-wrapping in nested try/catch blocks).
 *
 * @param phase - Pipeline stage attributing the failure.
 * @param message - Prefix message; the underlying error's message is appended.
 * @param cause - Value caught in a `try/catch` — may or may not be an `Error`.
 * @param context - Optional debug context bag.
 * @returns An {@link IconsExecutorError} safe to throw.
 */
const asIconsError = (
  phase: IconsPhase,
  message: string,
  cause: unknown,
  context?: Record<string, unknown>,
): IconsExecutorError => {
  if (cause instanceof IconsExecutorError) return cause;
  const causeMessage = cause instanceof Error ? cause.message : String(cause);
  return new IconsExecutorError(phase, `${message}: ${causeMessage}`, { cause, context });
};

export type { IconsExecutorErrorOptions, IconsPhase };
export { asIconsError, IconsExecutorError };
