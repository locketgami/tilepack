import Jimp from "jimp";

export function isValidPosterizeLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 2 && level <= 255;
}

export function validatePosterizeLevel(level: number): void {
  if (!isValidPosterizeLevel(level)) {
    throw new RangeError(
      `Posterize level must be an integer between 2 and 255, got: ${level}`
    );
  }
}

export function posterizeChannel(value: number, levels: number): number {
  const step = 255 / (levels - 1);
  return Math.round(Math.round(value / step) * step);
}

export function applyPosterize(frame: Jimp, levels: number): Jimp {
  validatePosterizeLevel(levels);
  const result = frame.clone();
  result.scan(0, 0, result.bitmap.width, result.bitmap.height, (x, y, idx) => {
    const data = result.bitmap.data;
    data[idx + 0] = posterizeChannel(data[idx + 0], levels);
    data[idx + 1] = posterizeChannel(data[idx + 1], levels);
    data[idx + 2] = posterizeChannel(data[idx + 2], levels);
    // alpha unchanged
  });
  return result;
}

export function posterizeLabel(levels: number): string {
  return `posterize(${levels})`;
}
