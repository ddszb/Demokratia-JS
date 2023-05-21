import { GlobalFonts } from '@napi-rs/canvas';
import { glob } from 'glob';
import { promisify } from 'util';

export type Font =
  | 'Baskerville-Regular'
  | 'Cambria'
  | 'Futura-Medium'
  | 'GreatAttraction'
  | 'AppleColorEmoji'
  | 'MovieTimes';

const FONT_PATH = './src/resources/fonts/*';

export const loadFonts = async () => {
  const globPromise = promisify(glob);
  const fontFiles = await globPromise(FONT_PATH);
  fontFiles.forEach(async (filePath) => {
    const path = filePath;
    const filename = filePath.split('\\').pop().split('/').pop();
    const name = filename.substring(0, filename.lastIndexOf('.'));
    GlobalFonts.registerFromPath(path, name);
  });
};
