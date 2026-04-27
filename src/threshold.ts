import Jimp from "jimp";

export function isValidThreshold(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 255;
}

export function validateThreshold(value: number): void {
  if (!isValidThreshold(value)) {
    throw new RangeError(
      `Threshold must be a number between 0 and 255, got: ${value}`
    );
  }
}

export function applyThreshold(
  frame: Jimp,
  threshold: number,
  replace = false
): Jimp {
  validateThreshold(threshold);
  const out = frame.clone();
  out.scan(0, 0, out.bitmap.width, out.bitmap.height, (_x, _y, idx) => {
    const r = out.bitmap.data[idx];
    const g = out.bitmap.data[idx + 1];
    const b = out.bitmap.data[idx + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    const val = luma >= threshold ? 255 : 0;
    out.bitmap.data[idx] = val;
    out.bitmap.data[idx + 1] = val;
    out.bitmap.data[idx + 2] = val;
    if (replace) {
      out.bitmap.data[idx + 3] = luma >= threshold ? 255 : 0;
    }
  });
  return out;
}

export function thresholdLabel(threshold: number, replace: boolean): string {
  return replace
    ? `threshold(${threshold}, replace)`
    : `threshold(${threshold})`;
}
