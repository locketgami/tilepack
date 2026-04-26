import { isValidGamma } from "./gamma";

export interface GammaConfig {
  enabled: boolean;
  value: number;
}

export const defaultGammaConfig: GammaConfig = {
  enabled: false,
  value: 1.0,
};

/**
 * Parse gamma config from a raw config object.
 * Accepts { gamma: number } or { gamma: { value: number } }
 */
export function parseGammaConfig(raw: Record<string, unknown>): GammaConfig {
  const entry = raw["gamma"];

  if (entry === undefined || entry === null) {
    return { ...defaultGammaConfig };
  }

  if (typeof entry === "number") {
    if (!isValidGamma(entry)) {
      throw new RangeError(`Invalid gamma value: ${entry}`);
    }
    return { enabled: true, value: entry };
  }

  if (typeof entry === "object" && !Array.isArray(entry)) {
    const obj = entry as Record<string, unknown>;
    const value = typeof obj["value"] === "number" ? obj["value"] : 1.0;
    const enabled = typeof obj["enabled"] === "boolean" ? obj["enabled"] : true;
    if (!isValidGamma(value)) {
      throw new RangeError(`Invalid gamma value: ${value}`);
    }
    return { enabled, value };
  }

  throw new TypeError(`Unexpected gamma config type: ${typeof entry}`);
}

export function shouldApplyGamma(config: GammaConfig): boolean {
  return config.enabled && config.value !== 1.0;
}
