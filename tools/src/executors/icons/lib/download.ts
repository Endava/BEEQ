import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { Readable } from 'node:stream';

import { ensureDir, writeFile } from 'fs-extra';

import { asIconsError, IconsExecutorError } from './errors';

/** Result of a successful archive download. */
type DownloadResult = {
  /**
   * Raw archive bytes in memory (used by extraction and kept in the
   * return type for future streaming reuse).
   */
  buffer: Buffer;
  /** Computed `sha256-<hex>` of the downloaded bytes. */
  checksum: string;
};

/** Inputs for {@link downloadArchive}. */
type DownloadOptions = {
  /** Absolute on-disk path where the archive is persisted after a successful download. */
  archiveFilePath: string;
  /** Fully-qualified URL of the archive (already built by the options layer). */
  archiveUrl: string;
  /**
   * Optional `sha256-<hex>` checksum. When set, a mismatch throws before
   * the archive is written to disk.
   */
  expectedChecksum?: string;
};

/**
 * Compute the `sha256-<hex>` checksum of a buffer.
 *
 * @param buffer - Bytes to hash.
 * @returns The `sha256-<hex>` string.
 */
const sha256 = (buffer: Buffer): string => `sha256-${createHash('sha256').update(buffer).digest('hex')}`;

/**
 * Drain a `fetch` `ReadableStream` body into a single {@link Buffer}. Uses
 * Node's `Readable.fromWeb` so we can `for await` over web streams without
 * pulling in a userland polyfill.
 *
 * @param body - The web `ReadableStream` returned by `fetch`.
 * @returns A promise that resolves with the fully-buffered response.
 */
const readResponse = async (body: ReadableStream<Uint8Array>): Promise<Buffer> => {
  const stream = Readable.fromWeb(body as never);
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

/**
 * Download an archive from `archiveUrl`, verify its optional checksum, and
 * persist it to `archiveFilePath`.
 *
 * The full response is buffered in memory (Phosphor archives are ~15 MB) so
 * we can compute the sha256 before writing to disk — this makes the
 * `expectedChecksum` check fail-fast without ever creating a partial file.
 *
 * All failure modes are wrapped in {@link IconsExecutorError} tagged with
 * the appropriate `IconsPhase` (`download` or `checksum`).
 *
 * @param options - See {@link DownloadOptions}.
 * @returns A promise that resolves with the buffered archive and its
 *   computed checksum.
 * @throws {IconsExecutorError} On network failures, non-OK HTTP responses,
 *   body read errors, checksum mismatches, or filesystem write errors.
 */
const downloadArchive = async ({
  archiveFilePath,
  archiveUrl,
  expectedChecksum,
}: DownloadOptions): Promise<DownloadResult> => {
  let response: Response;
  try {
    response = await fetch(archiveUrl, { redirect: 'follow' });
  } catch (error) {
    throw asIconsError('download', `Network request failed for "${archiveUrl}"`, error, { archiveUrl });
  }

  if (!response.ok || !response.body) {
    throw new IconsExecutorError(
      'download',
      `Request failed with status ${response.status} for "${archiveUrl}": ${response.statusText || 'no body'}`,
      { context: { archiveUrl, status: response.status } },
    );
  }

  let buffer: Buffer;
  try {
    buffer = await readResponse(response.body);
  } catch (error) {
    throw asIconsError('download', `Failed to read archive response body`, error, { archiveUrl });
  }

  const checksum = sha256(buffer);

  if (expectedChecksum && expectedChecksum.toLowerCase() !== checksum) {
    throw new IconsExecutorError(
      'checksum',
      `Archive checksum mismatch. Expected "${expectedChecksum}" but got "${checksum}".`,
      { context: { archiveUrl, expectedChecksum, actualChecksum: checksum } },
    );
  }

  try {
    await ensureDir(dirname(archiveFilePath));
    await writeFile(archiveFilePath, buffer);
  } catch (error) {
    throw asIconsError('download', `Failed to persist archive to "${archiveFilePath}"`, error, { archiveFilePath });
  }

  return { buffer, checksum };
};

export type { DownloadOptions, DownloadResult };
export { downloadArchive };
