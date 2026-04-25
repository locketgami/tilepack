import Jimp from "jimp";

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropResult {
  image: Jimp;
  rect: CropRect;
  wasCropped: boolean;
}

/**
 * Crops a Jimp image to the given rectangle.
 */
export function cropImage(image: Jimp, rect: CropRect): Jimp {
  return image.clone().crop(rect.x, rect.y, rect.width, rect.height);
}

/**
 * Auto-crops transparent borders from a frame image.
 * Returns the cropped image and the bounding rect used.
 */
export function autoCropFrame(image: Jimp): CropResult {
  const w = image.getWidth();
  const h = image.getHeight();

  let minX = w, minY = h, maxX = 0, maxY = 0;
  let found = false;

  image.scan(0, 0, w, h, (x, y, idx) => {
    const alpha = image.bitmap.data[idx + 3];
    if (alpha > 0) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      found = true;
    }
  });

  if (!found) {
    const rect: CropRect = { x: 0, y: 0, width: w, height: h };
    return { image: image.clone(), rect, wasCropped: false };
  }

  const rect: CropRect = {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };

  const wasCropped = minX !== 0 || minY !== 0 || rect.width !== w || rect.height !== h;
  return { image: cropImage(image, rect), rect, wasCropped };
}

/**
 * Returns the pixel area saved by cropping.
 */
export function cropBytesSaved(original: CropRect, cropped: CropRect): number {
  const before = original.width * original.height;
  const after = cropped.width * cropped.height;
  return Math.max(0, before - after) * 4;
}
