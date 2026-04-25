import Jimp from "jimp";

export type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "add";

export const VALID_BLEND_MODES: BlendMode[] = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "add",
];

export function isValidBlendMode(mode: string): mode is BlendMode {
  return VALID_BLEND_MODES.includes(mode as BlendMode);
}

export function blendPixel(
  src: number,
  dst: number,
  mode: BlendMode
): number {
  const s = src / 255;
  const d = dst / 255;
  let result: number;

  switch (mode) {
    case "multiply":
      result = s * d;
      break;
    case "screen":
      result = 1 - (1 - s) * (1 - d);
      break;
    case "overlay":
      result = d < 0.5 ? 2 * s * d : 1 - 2 * (1 - s) * (1 - d);
      break;
    case "add":
      result = Math.min(1, s + d);
      break;
    case "normal":
    default:
      result = s;
      break;
  }

  return Math.round(result * 255);
}

export function applyBlend(
  base: Jimp,
  overlay: Jimp,
  mode: BlendMode,
  opacity: number = 1.0
): Jimp {
  const out = base.clone();
  const w = Math.min(base.getWidth(), overlay.getWidth());
  const h = Math.min(base.getHeight(), overlay.getHeight());

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const baseColor = Jimp.intToRGBA(base.getPixelColor(x, y));
      const overColor = Jimp.intToRGBA(overlay.getPixelColor(x, y));
      const alpha = (overColor.a / 255) * opacity;

      const r = Math.round(blendPixel(overColor.r, baseColor.r, mode) * alpha + baseColor.r * (1 - alpha));
      const g = Math.round(blendPixel(overColor.g, baseColor.g, mode) * alpha + baseColor.g * (1 - alpha));
      const b = Math.round(blendPixel(overColor.b, baseColor.b, mode) * alpha + baseColor.b * (1 - alpha));
      const a = Math.min(255, baseColor.a + overColor.a);

      out.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y);
    }
  }

  return out;
}
