import Jimp from "jimp";

/**
 * Gamma correction for sprite frames.
 * Values > 1 brighten, values < 1 darken.
 */

export const GAMMA_MIN = 0.1;
export const GAMMA_MAX = 10.0;

export function isValidGamma(value: number): boolean {
  return Number.isFinite(value) && value >= GAMMA_MIN && value <= GAMMA_MAX;
}

export function validateGamma(value: number): void {
  if (!isValidGamma(value)) {
    throw new RangeError(
      `Gamma must be between ${GAMMA_MIN} and ${GAMMA_MAX}, got ${value}`
    );
  }
}

/**
 * Apply gamma correction to a single Jimp image in-place.
 * Uses the standard power-law transform: out = in^(1/gamma)
 */
export function applyGamma(image: Jimp, gamma: number): Jimp {
  validateGamma(gamma);
  const inv = 1 / gamma;
  image.scan(0, 0, image.getWidth(), image.getHeight(), function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    this.bitmap.data[idx] = Math.round(Math.pow(r / 255, inv) * 255);
    this.bitmap.data[idx + 1] = Math.round(Math.pow(g / 255, inv) * 255);
    this.bitmap.data[idx + 2] = Math.round(Math.pow(b / 255, inv) * 255);
    // alpha channel unchanged
  });
  return image;
}

export function gammaLabel(gamma: number): string {
  return `gamma(${gamma.toFixed(2)})`;
}
