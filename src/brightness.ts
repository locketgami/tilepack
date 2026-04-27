import Jimp from "jimp";

export type BrightnessFrame = {
  image: Jimp;
  name: string;
};

export function isValidBrightness(value: number): boolean {
  return Number.isFinite(value) && value >= -1 && value <= 1;
}

export function validateBrightness(value: number): void {
  if (!isValidBrightness(value)) {
    throw new RangeError(
      `Brightness must be a finite number between -1 and 1, got ${value}`
    );
  }
}

export function applyBrightness(frame: BrightnessFrame, amount: number): BrightnessFrame {
  validateBrightness(amount);
  if (amount === 0) return frame;
  const adjusted = frame.image.clone().brightness(amount);
  return { ...frame, image: adjusted };
}

export function applyContrast(frame: BrightnessFrame, amount: number): BrightnessFrame {
  validateBrightness(amount);
  if (amount === 0) return frame;
  const adjusted = frame.image.clone().contrast(amount);
  return { ...frame, image: adjusted };
}

export function brightnessLabel(amount: number, contrast: number): string {
  const parts: string[] = [];
  if (amount !== 0) parts.push(`brightness(${amount > 0 ? "+" : ""}${amount})`);
  if (contrast !== 0) parts.push(`contrast(${contrast > 0 ? "+" : ""}${contrast})`);
  return parts.length > 0 ? parts.join(" ") : "brightness(none)";
}
