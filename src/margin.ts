/**
 * margin.ts — utilities for adding padding/extrusion around packed frames
 */

export interface MarginOptions {
  padding: number;  // inner padding between frames
  extrude: number;  // repeat edge pixels outward (bleed)
}

export const defaultMarginOptions: MarginOptions = {
  padding: 1,
  extrude: 0,
};

export function validateMarginOptions(opts: MarginOptions): void {
  if (!Number.isInteger(opts.padding) || opts.padding < 0) {
    throw new Error(`padding must be a non-negative integer, got: ${opts.padding}`);
  }
  if (!Number.isInteger(opts.extrude) || opts.extrude < 0) {
    throw new Error(`extrude must be a non-negative integer, got: ${opts.extrude}`);
  }
}

/**
 * Returns the total border size added around each frame.
 * padding is applied on all sides; extrude sits outside padding.
 */
export function totalBorder(opts: MarginOptions): number {
  return opts.padding + opts.extrude;
}

/**
 * Given a frame's packed (x, y) position and size, returns the
 * source rectangle accounting for inner padding only (no extrude).
 */
export function innerRect(
  x: number,
  y: number,
  w: number,
  h: number,
  opts: MarginOptions
): { x: number; y: number; w: number; h: number } {
  const border = totalBorder(opts);
  return {
    x: x + border,
    y: y + border,
    w: w - border * 2,
    h: h - border * 2,
  };
}

/**
 * Computes the padded dimensions of a frame given its natural size.
 */
export function paddedSize(
  naturalW: number,
  naturalH: number,
  opts: MarginOptions
): { w: number; h: number } {
  const border = totalBorder(opts);
  return {
    w: naturalW + border * 2,
    h: naturalH + border * 2,
  };
}
