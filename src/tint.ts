import { RawFrame } from "./types";

export type TintColor = { r: number; g: number; b: number };

export function isValidTintStrength(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

export function validateTintStrength(value: number): void {
  if (!isValidTintStrength(value)) {
    throw new RangeError(
      `Tint strength must be between 0 and 1, got ${value}`
    );
  }
}

export function parseTintColor(hex: string): TintColor {
  const clean = hex.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    throw new Error(`Invalid tint color: "${hex}". Expected #RRGGBB format.`);
  }
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

export function applyTint(
  frame: RawFrame,
  color: TintColor,
  strength: number
): RawFrame {
  validateTintStrength(strength);
  const data = Buffer.from(frame.data);
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = Math.round(data[i + 0] * (1 - strength) + color.r * strength);
    data[i + 1] = Math.round(data[i + 1] * (1 - strength) + color.g * strength);
    data[i + 2] = Math.round(data[i + 2] * (1 - strength) + color.b * strength);
    // alpha unchanged
  }
  return { ...frame, data };
}

export function tintLabel(color: TintColor, strength: number): string {
  const hex = [
    color.r.toString(16).padStart(2, "0"),
    color.g.toString(16).padStart(2, "0"),
    color.b.toString(16).padStart(2, "0"),
  ].join("");
  return `tint(#${hex}, ${strength})`;
}
