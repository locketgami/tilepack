import Jimp from "jimp";
import {
  isValidAngle,
  parseRotateAngle,
  rotatedDimensions,
  rotateFrame,
  rotateFrames,
} from "./rotate";

async function makeFrame(width: number, height: number): Promise<Jimp> {
  return new Jimp(width, height, 0xff0000ff);
}

describe("isValidAngle", () => {
  it("accepts 90, 180, 270", () => {
    expect(isValidAngle(90)).toBe(true);
    expect(isValidAngle(180)).toBe(true);
    expect(isValidAngle(270)).toBe(true);
  });

  it("rejects other values", () => {
    expect(isValidAngle(0)).toBe(false);
    expect(isValidAngle(45)).toBe(false);
    expect(isValidAngle(360)).toBe(false);
  });
});

describe("parseRotateAngle", () => {
  it("parses valid angle strings", () => {
    expect(parseRotateAngle("90")).toBe(90);
    expect(parseRotateAngle(180)).toBe(180);
  });

  it("throws on invalid angle", () => {
    expect(() => parseRotateAngle(45)).toThrow("Invalid rotation angle");
    expect(() => parseRotateAngle("abc")).toThrow();
  });
});

describe("rotatedDimensions", () => {
  it("swaps dimensions for 90 and 270", () => {
    expect(rotatedDimensions(64, 32, 90)).toEqual({ width: 32, height: 64 });
    expect(rotatedDimensions(64, 32, 270)).toEqual({ width: 32, height: 64 });
  });

  it("preserves dimensions for 180", () => {
    expect(rotatedDimensions(64, 32, 180)).toEqual({ width: 64, height: 32 });
  });
});

describe("rotateFrame", () => {
  it("returns a new frame with swapped dimensions for 90 degrees", async () => {
    const frame = await makeFrame(64, 32);
    const rotated = await rotateFrame(frame, { angle: 90 });
    expect(rotated.getWidth()).toBe(32);
    expect(rotated.getHeight()).toBe(64);
  });

  it("does not mutate the original frame", async () => {
    const frame = await makeFrame(64, 32);
    await rotateFrame(frame, { angle: 90 });
    expect(frame.getWidth()).toBe(64);
    expect(frame.getHeight()).toBe(32);
  });
});

describe("rotateFrames", () => {
  it("rotates all frames", async () => {
    const frames = [await makeFrame(64, 32), await makeFrame(64, 32)];
    const result = await rotateFrames(frames, { angle: 270 });
    expect(result).toHaveLength(2);
    result.forEach((f) => {
      expect(f.getWidth()).toBe(32);
      expect(f.getHeight()).toBe(64);
    });
  });
});
