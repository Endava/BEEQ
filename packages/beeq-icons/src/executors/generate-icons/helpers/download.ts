import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

interface IDownloadIcons {
  downloadPath: string;
  fileName: string;
  sourceUrl: string;
}

export const downloadIcons = async ({ downloadPath, fileName, sourceUrl }: IDownloadIcons) => {
  try {
    const response = await fetch(`${sourceUrl}/${fileName}`);
    if (!response.body || !response.ok) throw new Error(response.statusText);

    const ws = createWriteStream(join(downloadPath, fileName));
    // @ts-expect-error
    await finished(Readable.fromWeb(response.body).pipe(ws));
    Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
};
