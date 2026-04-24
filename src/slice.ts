import Jimp from "jimp";

export interface FrameRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SlicedFrame {
  index: number;
  image: Jimp;
  rect: FrameRect;
  sourcePath: string;
}

/**
 * Slice a sprite sheet into individual frames given a fixed frame size.
 */
export async function sliceSheet(
  sourcePath: string,
  frameWidth: number,
  frameHeight: number
): Promise<SlicedFrame[]> {
  const sheet = await Jimp.read(sourcePath);
  const sheetWidth = sheet.getWidth();
  const sheetHeight = sheet.getHeight();

  if (frameWidth <= 0 || frameHeight <= 0) {
    throw new Error(`Invalid frame size: ${frameWidth}x${frameHeight}`);
  }
  if (sheetWidth % frameWidth !== 0 || sheetHeight % frameHeight !== 0) {
    throw new Error(
      `Sheet size ${sheetWidth}x${sheetHeight} is not evenly divisible by frame size ${frameWidth}x${frameHeight}`
    );
  }

  const cols = sheetWidth / frameWidth;
  const rows = sheetHeight / frameHeight;
  const frames: SlicedFrame[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const rect: FrameRect = {
        x: col * frameWidth,
        y: row * frameHeight,
        w: frameWidth,
        h: frameHeight,
      };
      const cropped = sheet.clone().crop(rect.x, rect.y, rect.w, rect.h);
      frames.push({
        index: row * cols + col,
        image: cropped,
        rect,
        sourcePath,
      });
    }
  }

  return frames;
}

/**
 * Return the number of frames in a sheet without loading pixel data.
 */
export function frameCountFromDimensions(
  sheetWidth: number,
  sheetHeight: number,
  frameWidth: number,
  frameHeight: number
): number {
  if (frameWidth <= 0 || frameHeight <= 0) return 0;
  const cols = Math.floor(sheetWidth / frameWidth);
  const rows = Math.floor(sheetHeight / frameHeight);
  return cols * rows;
}
