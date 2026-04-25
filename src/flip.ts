import Jimp from "jimp";

export type FlipAxis = "horizontal" | "vertical" | "both";

export interface FlipOptions {
  axis: FlipAxis;
}

export interface Frame {
  image: Jimp;
  name: string;
  width: number;
  height: number;
}

export function isValidFlipAxis(value: string): value is FlipAxis {
  return value === "horizontal" || value === "vertical" || value === "both";
}

export function parseFlipAxis(raw: unknown): FlipAxis {
  if (typeof raw !== "string" || !isValidFlipAxis(raw)) {
    throw new Error(
      `Invalid flip axis "${raw}". Expected "horizontal", "vertical", or "both".`
    );
  }
  return raw;
}

export function flipFrame(frame: Frame, options: FlipOptions): Frame {
  const { axis } = options;
  const cloned = frame.image.clone();

  if (axis === "horizontal" || axis === "both") {
    cloned.flip(true, false);
  }
  if (axis === "vertical" || axis === "both") {
    cloned.flip(false, true);
  }

  return {
    ...frame,
    image: cloned,
  };
}

export function flipFrames(frames: Frame[], options: FlipOptions): Frame[] {
  return frames.map((frame) => flipFrame(frame, options));
}

export function flipLabel(options: FlipOptions): string {
  return `flip:${options.axis}`;
}
