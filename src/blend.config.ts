import { BlendMode } from "./blend";

/**
 * Parsed blend configuration from tilepack config file.
 */
export interface BlendConfig {
  mode: BlendMode;
  color: [number, number, number, number];
  opacity: number;
}

const DEFAULT_BLEND_CONFIG: BlendConfig = {
  mode: "normal",
  color: [0, 0, 0, 255],
  opacity: 1.0,
};

/**
 * Parse raw config object into a validated BlendConfig.
 * Falls back to defaults for missing or invalid fields.
 */
export function parseBlendConfig(raw: unknown): BlendConfig {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_BLEND_CONFIG };
  }

  const obj = raw as Record<string, unknown>;

  const mode = isValidBlendMode(obj.mode)
    ? (obj.mode as BlendMode)
    : DEFAULT_BLEND_CONFIG.mode;

  const color = parseColor(obj.color) ?? DEFAULT_BLEND_CONFIG.color;

  const opacity =
    typeof obj.opacity === "number" &&
    obj.opacity >= 0 &&
    obj.opacity <= 1
      ? obj.opacity
      : DEFAULT_BLEND_CONFIG.opacity;

  return { mode, color, opacity };
}

/**
 * Returns true if blending should be applied based on config.
 * Blend is skipped when opacity is 0 or mode is "normal" with full opacity.
 */
export function shouldApplyBlend(config: BlendConfig): boolean {
  if (config.opacity === 0) return false;
  if (config.mode === "normal" && config.opacity === 1.0) return false;
  return true;
}

/**
 * Human-readable label for the active blend configuration.
 */
export function blendLabel(config: BlendConfig): string {
  return `${config.mode} @ ${Math.round(config.opacity * 100)}%`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_BLEND_MODES: BlendMode[] = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "add",
  "subtract",
];

function isValidBlendMode(value: unknown): value is BlendMode {
  return typeof value === "string" && (VALID_BLEND_MODES as string[]).includes(value);
}

function parseColor(
  value: unknown
): [number, number, number, number] | null {
  if (!Array.isArray(value)) return null;
  if (value.length < 3 || value.length > 4) return null;
  const channels = value.length === 3 ? [...value, 255] : value;
  if (!channels.every((c) => typeof c === "number" && c >= 0 && c <= 255)) {
    return null;
  }
  return channels as [number, number, number, number];
}
