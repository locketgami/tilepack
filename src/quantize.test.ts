import Jimp from "jimp";
import {
  isValidQuantizeMode,
  validateColorCount,
  quantizeFrame,
  quantizeBytesSaved,
  defaultQuantizeOptions,
} from "./quantize";

function makeFrame(width: number, height: number, fill = 0xff0000ff): Jimp {
  const img = new Jimp(width, height);
  img.scan(0, 0, width, height, (_x, _y, idx) => {
    img.bitmap.data.writeUInt32BE(fill, idx);
  });
  return img;
}

describe("isValidQuantizeMode", () => {
  it("accepts valid modes", () => {
    expect(isValidQuantizeMode("none")).toBe(true);
    expect(isValidQuantizeMode("median-cut")).toBe(true);
    expect(isValidQuantizeMode("octree")).toBe(true);
  });

  it("rejects unknown modes", () => {
    expect(isValidQuantizeMode("posterize")).toBe(false);
    expect(isValidQuantizeMode("")).toBe(false);
  });
});

describe("validateColorCount", () => {
  it("accepts valid counts", () => {
    expect(() => validateColorCount(2)).not.toThrow();
    expect(() => validateColorCount(128)).not.toThrow();
    expect(() => validateColorCount(256)).not.toThrow();
  });

  it("rejects out-of-range values", () => {
    expect(() => validateColorCount(1)).toThrow();
    expect(() => validateColorCount(257)).toThrow();
    expect(() => validateColorCount(0)).toThrow();
  });

  it("rejects non-integers", () => {
    expect(() => validateColorCount(16.5)).toThrow();
  });
});

describe("quantizeFrame", () => {
  it("returns original frame when mode is none", () => {
    const frame = makeFrame(4, 4);
    const result = quantizeFrame(frame, defaultQuantizeOptions);
    expect(result).toBe(frame);
  });

  it("returns a Jimp instance for median-cut mode", () => {
    const frame = makeFrame(8, 8, 0x80604020);
    const result = quantizeFrame(frame, { mode: "median-cut", colors: 16, dither: false });
    expect(result).toBeInstanceOf(Jimp);
    expect(result.bitmap.width).toBe(8);
    expect(result.bitmap.height).toBe(8);
  });

  it("preserves alpha channel", () => {
    const frame = makeFrame(4, 4, 0xff000080);
    const result = quantizeFrame(frame, { mode: "octree", colors: 32, dither: false });
    const alpha = result.bitmap.data[3];
    expect(alpha).toBe(0x80);
  });
});

describe("quantizeBytesSaved", () => {
  it("returns 0 for identical images", () => {
    const frame = makeFrame(4, 4);
    expect(quantizeBytesSaved(frame, frame)).toBe(0);
  });

  it("returns a non-negative number", () => {
    const original = makeFrame(8, 8, 0xaabbccff);
    const quantized = makeFrame(8, 8, 0xaabbccff);
    expect(quantizeBytesSaved(original, quantized)).toBeGreaterThanOrEqual(0);
  });
});
