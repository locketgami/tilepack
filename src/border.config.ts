export interface BorderConfig {
  size?: number;
  mode?: string;
}

export type BorderMode = "solid" | "clamp" | "transparent";

const VALID_MODES: BorderMode[] = ["solid", "clamp", "transparent"];

export function isValidBorderMode(mode: string): mode is BorderMode {
  return VALID_MODES.includes(mode as BorderMode);
}

export function parseBorderConfig(raw: unknown): { size: number; mode: BorderMode } | null {
  if (raw === null || raw === undefined || raw === false) return null;

  const config = typeof raw === "object" ? (raw as BorderConfig) : {};

  const size = typeof (config as BorderConfig).size === "number" ? (config as BorderConfig).size! : 1;
  const modeRaw = typeof (config as BorderConfig).mode === "string" ? (config as BorderConfig).mode! : "clamp";

  if (!isValidBorderMode(modeRaw)) {
    throw new Error(`Invalid border mode "${modeRaw}". Valid modes: ${VALID_MODES.join(", ")}`);
  }

  if (!Number.isInteger(size) || size < 0) {
    throw new Error(`Border size must be a non-negative integer, got: ${size}`);
  }

  return { size, mode: modeRaw };
}

export function shouldApplyBorder(config: ReturnType<typeof parseBorderConfig>): config is { size: number; mode: BorderMode } {
  return config !== null && config.size > 0;
}
