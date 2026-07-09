import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { ensureDir } from 'fs-extra';

interface IDownloadIcons {
  downloadPath: string;
  fileName: string;
  sourceUrl: string;
}

export const downloadIcons = async ({ downloadPath, fileName, sourceUrl }: IDownloadIcons) => {
  const downloadUrl = `${sourceUrl}/${fileName}`;

  try {
    await ensureDir(downloadPath);

    const response = await fetch(downloadUrl);
    if (!response.body || !response.ok) {
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }

    const ws = createWriteStream(join(downloadPath, fileName));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await finished(Readable.fromWeb(response.body).pipe(ws));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not download icons from "${downloadUrl}": ${message}`);
  }
};
