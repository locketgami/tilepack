// brightness.config.ts — parse and validate brightness/contrast config options

export interface BrightnessConfig {
  brightness: number; // -1.0 to 1.0
  contrast: number;   // -1.0 to 1.0
}

export const defaultBrightnessConfig: BrightnessConfig = {
  brightness: 0,
  contrast: 0,
};

export function parseBrightnessConfig(
  raw: Record<string, unknown> | undefined
): BrightnessConfig {
  if (!raw) return defaultBrightnessConfig;

  const brightness =
    typeof raw["brightness"] === "number" ? raw["brightness"] : 0;
  const contrast =
    typeof raw["contrast"] === "number" ? raw["contrast"] : 0;

  return { brightness, contrast };
}

export function shouldApplyBrightness(config: BrightnessConfig): boolean {
  return config.brightness !== 0 || config.contrast !== 0;
}

export function brightnessConfigLabel(config: BrightnessConfig): string {
  const parts: string[] = [];
  if (config.brightness !== 0) {
    parts.push(`brightness=${config.brightness > 0 ? "+" : ""}${config.brightness}`);
  }
  if (config.contrast !== 0) {
    parts.push(`contrast=${config.contrast > 0 ? "+" : ""}${config.contrast}`);
  }
  return parts.length > 0 ? parts.join(" ") : "no-op";
}
