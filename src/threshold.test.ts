import Jimp from "jimp";
import {
  isValidThreshold,
  validateThreshold,
  applyThreshold,
  thresholdLabel,
} from "./threshold";

function makeGrayFrame(width: number, height: number, fill: number): Jimp {
  const img = new Jimp(width, height, 0xffffffff);
  img.scan(0, 0, width, height, (_x, _y, idx) => {
    img.bitmap.data[idx] = fill;
    img.bitmap.data[idx + 1] = fill;
    img.bitmap.data[idx + 2] = fill;
    img.bitmap.data[idx + 3] = 255;
  });
  return img;
}

describe("isValidThreshold", () => {
  it("accepts 0 and 255", () => {
    expect(isValidThreshold(0)).toBe(true);
    expect(isValidThreshold(255)).toBe(true);
  });
  it("rejects out-of-range values", () => {
    expect(isValidThreshold(-1)).toBe(false);
    expect(isValidThreshold(256)).toBe(false);
  });
  it("rejects non-finite", () => {
    expect(isValidThreshold(NaN)).toBe(false);
    expect(isValidThreshold(Infinity)).toBe(false);
  });
});

describe("validateThreshold", () => {
  it("does not throw for valid values", () => {
    expect(() => validateThreshold(128)).not.toThrow();
  });
  it("throws for invalid values", () => {
    expect(() => validateThreshold(300)).toThrow(RangeError);
  });
});

describe("applyThreshold", () => {
  it("turns bright pixels white", () => {
    const frame = makeGrayFrame(2, 2, 200);
    const result = applyThreshold(frame, 128);
    expect(result.bitmap.data[0]).toBe(255);
  });

  it("turns dark pixels black", () => {
    const frame = makeGrayFrame(2, 2, 50);
    const result = applyThreshold(frame, 128);
    expect(result.bitmap.data[0]).toBe(0);
  });

  it("does not mutate original", () => {
    const frame = makeGrayFrame(2, 2, 200);
    applyThreshold(frame, 128);
    expect(frame.bitmap.data[0]).toBe(200);
  });

  it("sets alpha when replace=true for dark pixels", () => {
    const frame = makeGrayFrame(2, 2, 50);
    const result = applyThreshold(frame, 128, true);
    expect(result.bitmap.data[3]).toBe(0);
  });
});

describe("thresholdLabel", () => {
  it("returns simple label", () => {
    expect(thresholdLabel(128, false)).toBe("threshold(128)");
  });
  it("includes replace flag", () => {
    expect(thresholdLabel(64, true)).toBe("threshold(64, replace)");
  });
});
