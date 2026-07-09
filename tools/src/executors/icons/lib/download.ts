import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { Readable } from 'node:stream';

import { ensureDir, writeFile } from 'fs-extra';

import { IconsExecutorError, asIconsError } from './errors';

export interface DownloadResult {
  buffer: Buffer;
  checksum: string;
}

export interface DownloadOptions {
  archiveFilePath: string;
  archiveUrl: string;
  expectedChecksum?: string;
}

const sha256 = (buffer: Buffer): string => `sha256-${createHash('sha256').update(buffer).digest('hex')}`;

const readResponse = async (body: ReadableStream<Uint8Array>): Promise<Buffer> => {
  const stream = Readable.fromWeb(body as never);
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

export const downloadArchive = async ({
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
