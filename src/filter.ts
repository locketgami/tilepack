import sharp from "sharp";

import type { Sharp } from "sharp";

export type FilterMode = "nearest" | "linear" | "cubic" | "lanczos";

export interface FilterOptions {
  mode: FilterMode;
  sharpness?: number; // 0–3, only for lanczos
}

const KERNEL_MAP: Record<FilterMode, keyof sharp.KernelEnum> = {
  nearest: "nearest",
  linear: "linear",
  cubic: "cubic",
  lanczos: "lanczos3",
};

export function isValidFilterMode(mode: string): mode is FilterMode {
  return ["nearest", "linear", "cubic", "lanczos"].includes(mode);
}

export function resolveKernel(mode: FilterMode): keyof sharp.KernelEnum {
  return KERNEL_MAP[mode];
}

export function applyFilter(image: Sharp, options: FilterOptions): Sharp {
  const kernel = resolveKernel(options.mode);
  // sharp applies the kernel during resize; we tag metadata for downstream use
  return image.withMetadata({
    // store filter mode as custom icc-profile comment isn't ideal;
    // in practice the kernel is passed at resize time — this is a passthrough
  });
}

export function defaultFilterOptions(): FilterOptions {
  return { mode: "linear" };
}
