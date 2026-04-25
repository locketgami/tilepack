export interface CropConfig {
  /** Enable auto-cropping of transparent borders */
  enabled: boolean;
  /** Minimum pixel area reduction (in pixels²) required to apply crop */
  minSavingThreshold: number;
  /** Padding to add back around the cropped region */
  padding: number;
}

export const defaultCropConfig: CropConfig = {
  enabled: true,
  minSavingThreshold: 0,
  padding: 0,
};

export function parseCropConfig(raw: Partial<CropConfig> = {}): CropConfig {
  const config: CropConfig = { ...defaultCropConfig, ...raw };

  if (typeof config.minSavingThreshold !== "number" || config.minSavingThreshold < 0) {
    throw new Error(
      `crop.minSavingThreshold must be a non-negative number, got: ${config.minSavingThreshold}`
    );
  }

  if (typeof config.padding !== "number" || config.padding < 0) {
    throw new Error(
      `crop.padding must be a non-negative number, got: ${config.padding}`
    );
  }

  return config;
}

export function shouldApplyCrop(config: CropConfig, savedPixels: number): boolean {
  if (!config.enabled) return false;
  return savedPixels >= config.minSavingThreshold;
}
