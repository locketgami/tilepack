export interface ThresholdConfig {
  threshold: number;
  replace: boolean;
}

export const defaultThresholdConfig: ThresholdConfig = {
  threshold: 128,
  replace: false,
};

export function parseThresholdConfig(
  raw: Record<string, unknown>
): ThresholdConfig {
  const threshold =
    typeof raw.threshold === "number"
      ? raw.threshold
      : defaultThresholdConfig.threshold;

  const replace =
    typeof raw.replace === "boolean"
      ? raw.replace
      : defaultThresholdConfig.replace;

  return { threshold, replace };
}

export function shouldApplyThreshold(
  raw: Record<string, unknown> | undefined
): boolean {
  if (!raw) return false;
  return raw.threshold !== undefined;
}

export function thresholdConfigLabel(cfg: ThresholdConfig): string {
  const parts = [`threshold=${cfg.threshold}`];
  if (cfg.replace) parts.push("replace=true");
  return `threshold(${parts.join(", ")})`;
}
