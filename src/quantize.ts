import Jimp from "jimp";

export type QuantizeMode = "none" | "median-cut" | "octree";

export interface QuantizeOptions {
  mode: QuantizeMode;
  colors: number;
  dither: boolean;
}

export const defaultQuantizeOptions: QuantizeOptions = {
  mode: "none",
  colors: 256,
  dither: false,
};

export function isValidQuantizeMode(mode: string): mode is QuantizeMode {
  return ["none", "median-cut", "octree"].includes(mode);
}

export function validateColorCount(colors: number): void {
  if (!Number.isInteger(colors) || colors < 2 || colors > 256) {
    throw new Error(`color count must be an integer between 2 and 256, got ${colors}`);
  }
}

export function quantizeFrame(frame: Jimp, options: QuantizeOptions): Jimp {
  if (options.mode === "none") return frame;

  validateColorCount(options.colors);

  const result = frame.clone();
  const { width, height } = result.bitmap;

  // Reduce unique colors by quantizing each channel
  const step = Math.max(1, Math.floor(256 / options.colors));

  result.scan(0, 0, width, height, (_x, _y, idx) => {
    const buf = result.bitmap.data;
    buf[idx + 0] = Math.round(buf[idx + 0] / step) * step;
    buf[idx + 1] = Math.round(buf[idx + 1] / step) * step;
    buf[idx + 2] = Math.round(buf[idx + 2] / step) * step;
    // preserve alpha
  });

  return result;
}

export function quantizeBytesSaved(original: Jimp, quantized: Jimp): number {
  // Estimate: fewer unique colors -> better PNG compression
  const origColors = countUniqueColors(original);
  const quantColors = countUniqueColors(quantized);
  const ratio = Math.max(0, 1 - quantColors / Math.max(origColors, 1));
  return Math.floor(original.bitmap.data.length * ratio * 0.3);
}

function countUniqueColors(img: Jimp): number {
  const seen = new Set<number>();
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, (_x, _y, idx) => {
    const buf = img.bitmap.data;
    const key = (buf[idx] << 16) | (buf[idx + 1] << 8) | buf[idx + 2];
    seen.add(key);
  });
  return seen.size;
}
