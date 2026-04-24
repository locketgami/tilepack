import Jimp from "jimp";

export interface TrimRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TrimResult {
  rect: TrimRect;
  wasTrimmed: boolean;
}

/**
 * Scans an image and returns the bounding box of non-transparent pixels.
 * If the image is fully transparent, returns the original bounds.
 */
export function getTrimRect(image: Jimp): TrimRect {
  const { width, height } = image.bitmap;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  image.scan(0, 0, width, height, (x, y, idx) => {
    const alpha = image.bitmap.data[idx + 3];
    if (alpha > 0) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  });

  // Fully transparent image — return original size
  if (minX > maxX || minY > maxY) {
    return { x: 0, y: 0, width, height };
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * Trims transparent pixels from the edges of an image.
 * Returns the cropped Jimp instance and trim metadata.
 */
export async function trimImage(image: Jimp): Promise<{ image: Jimp; trim: TrimResult }> {
  const original = { width: image.bitmap.width, height: image.bitmap.height };
  const rect = getTrimRect(image);

  const wasTrimmed =
    rect.x !== 0 ||
    rect.y !== 0 ||
    rect.width !== original.width ||
    rect.height !== original.height;

  const cropped = wasTrimmed ? image.clone().crop(rect.x, rect.y, rect.width, rect.height) : image;

  return { image: cropped, trim: { rect, wasTrimmed } };
}
