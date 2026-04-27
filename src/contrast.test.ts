import Jimp from "jimp";
import {
  isValidContrast,
  validateContrast,
  applyContrastToFrame,
  applyContrastToFrames,
  contrastLabel,
  CONTRAST_MIN,
  CONTRAST_MAX,
} from "./contrast";

function makeFrame(width = 4, height = 4): Jimp {
  const img = new Jimp(width, height, 0xffffffff);
  return img;
}

describe("isValidContrast", () => {
  it("accepts values within range", () => {
    expect(isValidContrast(0)).toBe(true);
    expect(isValidContrast(-1.0)).toBe(true);
    expect(isValidContrast(1.0)).toBe(true);
    expect(isValidContrast(0.5)).toBe(true);
  });

  it("rejects out-of-range values", () => {
    expect(isValidContrast(-1.1)).toBe(false);
    expect(isValidContrast(1.1)).toBe(false);
    expect(isValidContrast(2)).toBe(false);
  });

  it("rejects non-finite values", () => {
    expect(isValidContrast(NaN)).toBe(false);
    expect(isValidContrast(Infinity)).toBe(false);
  });
});

describe("validateContrast", () => {
  it("does not throw for valid values", () => {
    expect(() => validateContrast(0)).not.toThrow();
    expect(() => validateContrast(CONTRAST_MIN)).not.toThrow();
    expect(() => validateContrast(CONTRAST_MAX)).not.toThrow();
  });

  it("throws RangeError for invalid values", () => {
    expect(() => validateContrast(1.5)).toThrow(RangeError);
    expect(() => validateContrast(-2)).toThrow(RangeError);
  });
});

describe("applyContrastToFrame", () => {
  it("returns a new Jimp instance", () => {
    const frame = makeFrame();
    const result = applyContrastToFrame(frame, 0.3);
    expect(result).toBeInstanceOf(Jimp);
    expect(result).not.toBe(frame);
  });

  it("preserves frame dimensions", () => {
    const frame = makeFrame(8, 16);
    const result = applyContrastToFrame(frame, -0.2);
    expect(result.getWidth()).toBe(8);
    expect(result.getHeight()).toBe(16);
  });

  it("throws for out-of-range contrast", () => {
    const frame = makeFrame();
    expect(() => applyContrastToFrame(frame, 2)).toThrow(RangeError);
  });
});

describe("applyContrastToFrames", () => {
  it("applies contrast to all frames", () => {
    const frames = [makeFrame(), makeFrame(), makeFrame()];
    const results = applyContrastToFrames(frames, 0.1);
    expect(results).toHaveLength(3);
    results.forEach((r) => expect(r).toBeInstanceOf(Jimp));
  });

  it("throws for invalid contrast on multi-frame input", () => {
    const frames = [makeFrame()];
    expect(() => applyContrastToFrames(frames, -5)).toThrow(RangeError);
  });
});

describe("contrastLabel", () => {
  it("formats positive contrast with plus sign", () => {
    expect(contrastLabel(0.5)).toBe("contrast(+0.50)");
  });

  it("formats negative contrast", () => {
    expect(contrastLabel(-0.25)).toBe("contrast(-0.25)");
  });

  it("formats zero", () => {
    expect(contrastLabel(0)).toBe("contrast(+0.00)");
  });
});
