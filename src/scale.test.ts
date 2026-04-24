import Jimp from "jimp";
import { scaleFrame, scaleFrames, scaledDimensions, validateScaleFactor } from "./scale";

async function makeImage(width: number, height: number): Promise<Jimp> {
  return new Jimp(width, height, 0xff0000ff);
}

describe("validateScaleFactor", () => {
  it("accepts valid factors", () => {
    expect(() => validateScaleFactor(0.5)).not.toThrow();
    expect(() => validateScaleFactor(1)).not.toThrow();
    expect(() => validateScaleFactor(2)).not.toThrow();
    expect(() => validateScaleFactor(8)).not.toThrow();
  });

  it("rejects zero", () => {
    expect(() => validateScaleFactor(0)).toThrow("positive");
  });

  it("rejects negative values", () => {
    expect(() => validateScaleFactor(-1)).toThrow("positive");
  });

  it("rejects factors above 8", () => {
    expect(() => validateScaleFactor(9)).toThrow("maximum");
  });
});

describe("scaledDimensions", () => {
  it("scales up correctly", () => {
    expect(scaledDimensions(16, 16, 2)).toEqual({ width: 32, height: 32 });
  });

  it("scales down correctly", () => {
    expect(scaledDimensions(32, 32, 0.5)).toEqual({ width: 16, height: 16 });
  });

  it("rounds fractional dimensions", () => {
    expect(scaledDimensions(10, 10, 1.5)).toEqual({ width: 15, height: 15 });
  });
});

describe("scaleFrame", () => {
  it("returns clone when factor is 1", async () => {
    const img = await makeImage(16, 16);
    const result = scaleFrame(img, { factor: 1 });
    expect(result.getWidth()).toBe(16);
    expect(result.getHeight()).toBe(16);
  });

  it("doubles image dimensions with factor 2", async () => {
    const img = await makeImage(16, 16);
    const result = scaleFrame(img, { factor: 2 });
    expect(result.getWidth()).toBe(32);
    expect(result.getHeight()).toBe(32);
  });

  it("halves image dimensions with factor 0.5", async () => {
    const img = await makeImage(32, 32);
    const result = scaleFrame(img, { factor: 0.5 });
    expect(result.getWidth()).toBe(16);
    expect(result.getHeight()).toBe(16);
  });
});

describe("scaleFrames", () => {
  it("scales all frames", async () => {
    const frames = await Promise.all([makeImage(8, 8), makeImage(8, 8)]);
    const result = scaleFrames(frames, { factor: 2 });
    expect(result).toHaveLength(2);
    result.forEach((f) => {
      expect(f.getWidth()).toBe(16);
      expect(f.getHeight()).toBe(16);
    });
  });
});
