import Jimp from "jimp";

export type ScaleMode = "nearest" | "bilinear" | "bicubic";

export interface ScaleOptions {
  factor: number;
  mode?: ScaleMode;
}

export function validateScaleFactor(factor: number): void {
  if (factor <= 0) {
    throw new Error(`Scale factor must be positive, got ${factor}`);
  }
  if (factor > 8) {
    throw new Error(`Scale factor ${factor} exceeds maximum of 8`);
  }
}

export function scaleFrame(
  image: Jimp,
  options: ScaleOptions
): Jimp {
  const { factor, mode = "nearest" } = options;

  validateScaleFactor(factor);

  if (factor === 1) return image.clone();

  const newWidth = Math.round(image.getWidth() * factor);
  const newHeight = Math.round(image.getHeight() * factor);

  const resizeMode =
    mode === "nearest"
      ? Jimp.RESIZE_NEAREST_NEIGHBOR
      : mode === "bilinear"
      ? Jimp.RESIZE_BILINEAR
      : Jimp.RESIZE_BICUBIC;

  return image.clone().resize(newWidth, newHeight, resizeMode);
}

export function scaleFrames(
  images: Jimp[],
  options: ScaleOptions
): Jimp[] {
  return images.map((img) => scaleFrame(img, options));
}

export function scaledDimensions(
  width: number,
  height: number,
  factor: number
): { width: number; height: number } {
  validateScaleFactor(factor);
  return {
    width: Math.round(width * factor),
    height: Math.round(height * factor),
  };
}
