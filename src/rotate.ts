import Jimp from "jimp";

type RotationAngle = 90 | 180 | 270;

export interface RotateOptions {
  angle: RotationAngle;
  expand?: boolean;
}

export function isValidAngle(value: number): value is RotationAngle {
  return value === 90 || value === 180 || value === 270;
}

export function parseRotateAngle(raw: unknown): RotationAngle {
  const n = Number(raw);
  if (!isValidAngle(n)) {
    throw new Error(`Invalid rotation angle: ${raw}. Must be 90, 180, or 270.`);
  }
  return n;
}

export function rotatedDimensions(
  width: number,
  height: number,
  angle: RotationAngle
): { width: number; height: number } {
  if (angle === 180) {
    return { width, height };
  }
  return { width: height, height: width };
}

export async function rotateFrame(
  frame: Jimp,
  options: RotateOptions
): Promise<Jimp> {
  const { angle, expand = true } = options;
  const clone = frame.clone();
  clone.rotate(-angle, expand);
  return clone;
}

export async function rotateFrames(
  frames: Jimp[],
  options: RotateOptions
): Promise<Jimp[]> {
  return Promise.all(frames.map((f) => rotateFrame(f, options)));
}
