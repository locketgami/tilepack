import { isValidFilterMode, defaultFilterOptions } from "./filter";
import type { FilterMode, FilterOptions } from "./filter";

export interface FilterConfig {
  filter?: string;
  sharpness?: number;
}

export function parseFilterConfig(raw: FilterConfig): FilterOptions {
  const mode: FilterMode = isValidFilterMode(raw.filter ?? "")
    ? (raw.filter as FilterMode)
    : defaultFilterOptions().mode;

  const sharpness =
    raw.sharpness !== undefined
      ? Math.max(0, Math.min(3, raw.sharpness))
      : undefined;

  return { mode, sharpness };
}

export function shouldApplyFilter(options: FilterOptions): boolean {
  return options.mode !== "nearest";
}

export function filterLabel(options: FilterOptions): string {
  const suffix =
    options.mode === "lanczos" && options.sharpness !== undefined
      ? `(sharpness=${options.sharpness})`
      : "";
  return `${options.mode}${suffix ? " " + suffix : ""}`;
}
