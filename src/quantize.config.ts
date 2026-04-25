/**
 * Configuration parsing and validation for the quantize (color reduction) step.
 * Quantization reduces the number of unique colors in a frame, which can
 * significantly shrink PNG file sizes for sprite sheets.
 */

export type QuantizeMode = "none" | "auto" | "force";

export interface QuantizeConfig {
  mode: QuantizeMode;
  /** Maximum number of colors in the palette (2–256) */
  colors: number;
  /** Whether to enable dithering during quantization */
  dither: boolean;
}

const DEFAULT_COLORS = 256;
const DEFAULT_DITHER = false;

const VALID_MODES: QuantizeMode[] = ["none", "auto", "force"];

export function isValidQuantizeMode(value: unknown): value is QuantizeMode {
  return VALID_MODES.includes(value as QuantizeMode);
}

/**
 * Parse and validate a raw config object into a QuantizeConfig.
 * Falls back to safe defaults for any missing or invalid fields.
 */
export function parseQuantizeConfig(raw: Record<string, unknown> = {}): QuantizeConfig {
  let mode: QuantizeMode = "none";
  if (isValidQuantizeMode(raw.mode)) {
    mode = raw.mode;
  } else if (raw.mode !== undefined) {
    throw new Error(
      `Invalid quantize mode "${raw.mode}". Expected one of: ${VALID_MODES.join(", ")}`
    );
  }

  let colors = DEFAULT_COLORS;
  if (raw.colors !== undefined) {
    const n = Number(raw.colors);
    if (!Number.isInteger(n) || n < 2 || n > 256) {
      throw new Error(
        `Invalid quantize color count "${raw.colors}". Must be an integer between 2 and 256.`
      );
    }
    colors = n;
  }

  const dither =
    raw.dither !== undefined ? Boolean(raw.dither) : DEFAULT_DITHER;

  return { mode, colors, dither };
}

/**
 * Returns true when quantization should actually be applied to a frame.
 * In "auto" mode, quantization is applied only when the frame already has
 * 256 or fewer unique colors (i.e., it's palette-friendly).
 *
 * @param config - Resolved quantize config
 * @param uniqueColors - Number of unique RGBA colors in the frame
 */
export function shouldApplyQuantize(
  config: QuantizeConfig,
  uniqueColors: number
): boolean {
  if (config.mode === "none") return false;
  if (config.mode === "force") return true;
  // auto: only quantize if the image is already palette-sized
  return uniqueColors <= 256;
}

/**
 * Human-readable label for logging / manifest metadata.
 */
export function quantizeLabel(config: QuantizeConfig): string {
  if (config.mode === "none") return "quantize:off";
  const dither = config.dither ? "+dither" : "";
  return `quantize:${config.mode}(${config.colors}${dither})`;
}
