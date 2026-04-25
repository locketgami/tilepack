/**
 * reorder.config.ts — parse reorder options from config/CLI
 */

import { ReorderMode, ReorderOptions, isValidReorderMode } from "./reorder";

export interface RawReorderConfig {
  mode?: string;
  descending?: boolean;
}

export function parseReorderConfig(raw: RawReorderConfig): ReorderOptions {
  const mode: ReorderMode = raw.mode !== undefined
    ? parseReorderMode(raw.mode)
    : "none";

  return {
    mode,
    descending: raw.descending ?? false,
  };
}

function parseReorderMode(value: string): ReorderMode {
  if (!isValidReorderMode(value)) {
    throw new Error(
      `Invalid reorder mode "${value}". Expected one of: none, name, area, width, height`
    );
  }
  return value;
}

export function shouldApplyReorder(options: ReorderOptions): boolean {
  return options.mode !== "none";
}

export function defaultReorderConfig(): ReorderOptions {
  return { mode: "none", descending: false };
}
