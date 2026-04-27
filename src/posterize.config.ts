import { isValidPosterizeLevel } from "./posterize";

export interface PosterizeConfig {
  enabled: boolean;
  levels: number;
}

export const defaultPosterizeConfig: PosterizeConfig = {
  enabled: false,
  levels: 4,
};

export function parsePosterizeConfig(
  raw: Record<string, unknown> | undefined
): PosterizeConfig {
  if (!raw) return { ...defaultPosterizeConfig };

  const enabled = raw["enabled"] === true;
  const rawLevels = raw["levels"];
  const levels =
    typeof rawLevels === "number" && isValidPosterizeLevel(rawLevels)
      ? rawLevels
      : defaultPosterizeConfig.levels;

  if (
    typeof rawLevels === "number" &&
    !isValidPosterizeLevel(rawLevels)
  ) {
    throw new RangeError(
      `Invalid posterize levels in config: ${rawLevels}. Must be integer 2–255.`
    );
  }

  return { enabled, levels };
}

export function shouldApplyPosterize(config: PosterizeConfig): boolean {
  return config.enabled && isValidPosterizeLevel(config.levels);
}
