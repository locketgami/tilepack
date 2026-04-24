import { ScaleMode } from "./scale";

export interface ScaleConfig {
  factor: number;
  mode: ScaleMode;
  variants: number[];
}

export const defaultScaleConfig: ScaleConfig = {
  factor: 1,
  mode: "nearest",
  variants: [],
};

export function parseScaleConfig(
  raw: Partial<ScaleConfig> | undefined
): ScaleConfig {
  if (!raw) return { ...defaultScaleConfig };

  const factor = raw.factor ?? defaultScaleConfig.factor;
  const mode = raw.mode ?? defaultScaleConfig.mode;
  const variants = Array.isArray(raw.variants) ? raw.variants : [];

  if (!isValidMode(mode)) {
    throw new Error(
      `Invalid scale mode "${mode}". Must be one of: nearest, bilinear, bicubic`
    );
  }

  return { factor, mode, variants };
}

export function isValidMode(mode: string): mode is ScaleMode {
  return ["nearest", "bilinear", "bicubic"].includes(mode);
}

export function allScaleFactors(config: ScaleConfig): number[] {
  const set = new Set([config.factor, ...config.variants]);
  return Array.from(set).sort((a, b) => a - b);
}
