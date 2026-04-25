import { RawFrame } from "./types";

export type BorderMode = "solid" | "clamp" | "transparent";

export interface BorderOptions {
  size: number;
  mode: BorderMode;
}

export function validateBorderOptions(opts: BorderOptions): void {
  if (!Number.isInteger(opts.size) || opts.size < 0) {
    throw new Error(`Border size must be a non-negative integer, got: ${opts.size}`);
  }
  if (opts.size > 64) {
    throw new Error(`Border size too large (max 64), got: ${opts.size}`);
  }
  const validModes: BorderMode[] = ["solid", "clamp", "transparent"];
  if (!validModes.includes(opts.mode)) {
    throw new Error(`Invalid border mode "${opts.mode}". Expected one of: ${validModes.join(", ")}`);
  }
}

export function borderedSize(width: number, height: number, size: number): { width: number; height: number } {
  return { width: width + size * 2, height: height + size * 2 };
}

export function applyBorder(frame: RawFrame, opts: BorderOptions): RawFrame {
  validateBorderOptions(opts);
  if (opts.size === 0) return frame;

  const { width, height, data } = frame;
  const newW = width + opts.size * 2;
  const newH = height + opts.size * 2;
  const out = Buffer.alloc(newW * newH * 4, 0);

  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      const srcX = Math.min(Math.max(x - opts.size, 0), width - 1);
      const srcY = Math.min(Math.max(y - opts.size, 0), height - 1);
      const dstIdx = (y * newW + x) * 4;

      if (opts.mode === "transparent" && (x < opts.size || x >= width + opts.size || y < opts.size || y >= height + opts.size)) {
        out[dstIdx] = 0;
        out[dstIdx + 1] = 0;
        out[dstIdx + 2] = 0;
        out[dstIdx + 3] = 0;
      } else {
        const srcIdx = (srcY * width + srcX) * 4;
        out[dstIdx] = data[srcIdx];
        out[dstIdx + 1] = data[srcIdx + 1];
        out[dstIdx + 2] = data[srcIdx + 2];
        out[dstIdx + 3] = data[srcIdx + 3];
      }
    }
  }

  return { ...frame, width: newW, height: newH, data: out };
}
