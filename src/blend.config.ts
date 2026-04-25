import { isValidBlendMode, BlendMode } from "./blend";

export interface BlendConfig {
  mode: BlendMode;
  opacity: number;
}

const DEFAULT_BLEND_CONFIG: BlendConfig = {
  mode: "normal",
  opacity: 1.0,
};

export function parseBlendConfig(
  raw: Record<string, unknown> | undefined
): BlendConfig {
  if (!raw) return { ...DEFAULT_BLEND_CONFIG };

  const mode = raw["mode"];
  const opacity = raw["opacity"];

  const resolvedMode: BlendMode =
    typeof mode === "string" && isValidBlendMode(mode)
      ? mode
      : DEFAULT_BLEND_CONFIG.mode;

  const resolvedOpacity: number =
    typeof opacity === "number" && opacity >= 0 && opacity <= 1
      ? opacity
      : DEFAULT_BLEND_CONFIG.opacity;

  return { mode: resolvedMode, opacity: resolvedOpacity };
}

export function shouldApplyBlend(config: BlendConfig): boolean {
  return config.mode !== "normal" || config.opacity < 1.0;
}

export function blendLabel(config: BlendConfig): string {
  return `blend:${config.mode}@${config.opacity.toFixed(2)}`;
}
