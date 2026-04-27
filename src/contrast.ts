import Jimp from "jimp";

/** Valid contrast range: -1.0 (min) to 1.0 (max) */
export const CONTRAST_MIN = -1.0;
export const CONTRAST_MAX = 1.0;

export function isValidContrast(value: number): boolean {
  return Number.isFinite(value) && value >= CONTRAST_MIN && value <= CONTRAST_MAX;
}

export function validateContrast(value: number): void {
  if (!isValidContrast(value)) {
    throw new RangeError(
      `Contrast must be between ${CONTRAST_MIN} and ${CONTRAST_MAX}, got ${value}`
    );
  }
}

/**
 * Apply contrast adjustment to a Jimp image frame.
 * Uses Jimp's built-in contrast method which accepts -1..1.
 */
export function applyContrastToFrame(frame: Jimp, amount: number): Jimp {
  validateContrast(amount);
  return frame.clone().contrast(amount);
}

/**
 * Apply contrast to multiple frames.
 */
export function applyContrastToFrames(frames: Jimp[], amount: number): Jimp[] {
  validateContrast(amount);
  return frames.map((f) => applyContrastToFrame(f, amount));
}

export function contrastLabel(amount: number): string {
  const sign = amount >= 0 ? "+" : "";
  return `contrast(${sign}${amount.toFixed(2)})`;
}
