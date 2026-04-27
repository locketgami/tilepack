import { parseTintColor, TintColor } from "./tint";

export interface TintConfig {
  color: TintColor;
  strength: number;
}

export function parseTintConfig(raw: Record<string, unknown>): TintConfig {
  const colorRaw = raw["tintColor"];
  if (typeof colorRaw !== "string") {
    throw new Error(`tintColor must be a string, got ${typeof colorRaw}`);
  }
  const color = parseTintColor(colorRaw);

  const strengthRaw = raw["tintStrength"];
  const strength =
    strengthRaw === undefined ? 0.5 : Number(strengthRaw);

  if (!Number.isFinite(strength) || strength < 0 || strength > 1) {
    throw new RangeError(
      `tintStrength must be between 0 and 1, got ${strengthRaw}`
    );
  }

  return { color, strength };
}

export function shouldApplyTint(raw: Record<string, unknown>): boolean {
  return typeof raw["tintColor"] === "string";
}

export function tintConfigLabel(config: TintConfig): string {
  const hex = [
    config.color.r.toString(16).padStart(2, "0"),
    config.color.g.toString(16).padStart(2, "0"),
    config.color.b.toString(16).padStart(2, "0"),
  ].join("");
  return `tint(#${hex} @ ${config.strength})`;
}
