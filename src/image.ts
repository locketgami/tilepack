import Jimp from 'jimp';
import path from 'path';

export interface ImageFrame {
  name: string;
  filePath: string;
  width: number;
  height: number;
  data: Jimp;
}

export async function loadImage(filePath: string): Promise<ImageFrame> {
  const img = await Jimp.read(filePath);
  const name = path.basename(filePath, path.extname(filePath));

  return {
    name,
    filePath,
    width: img.getWidth(),
    height: img.getHeight(),
    data: img,
  };
}

export async function loadImages(filePaths: string[]): Promise<ImageFrame[]> {
  const results = await Promise.allSettled(filePaths.map(loadImage));

  const frames: ImageFrame[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      frames.push(result.value);
    } else {
      console.warn(`[tilepack] Failed to load image: ${result.reason?.message ?? result.reason}`);
    }
  }

  return frames;
}

export function validateImageSize(
  frame: ImageFrame,
  tileWidth: number,
  tileHeight: number
): boolean {
  return frame.width % tileWidth === 0 && frame.height % tileHeight === 0;
}

export function getFrameCount(
  frame: ImageFrame,
  tileWidth: number,
  tileHeight: number
): number {
  const cols = Math.floor(frame.width / tileWidth);
  const rows = Math.floor(frame.height / tileHeight);
  return cols * rows;
}
