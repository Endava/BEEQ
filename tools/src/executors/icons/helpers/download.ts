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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await finished(Readable.fromWeb(response.body).pipe(ws));
  } catch (error) {
    throw new Error(error);
  }
};
