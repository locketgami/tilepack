import { validateBorderOptions, borderedSize, applyBorder } from "./border";
import { RawFrame } from "./types";

function makeFrame(width: number, height: number, fill = 255): RawFrame {
  const data = Buffer.alloc(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fill;
    data[i + 1] = fill;
    data[i + 2] = fill;
    data[i + 3] = 255;
  }
  return { width, height, data, name: "test" };
}

describe("validateBorderOptions", () => {
  it("accepts valid options", () => {
    expect(() => validateBorderOptions({ size: 2, mode: "clamp" })).not.toThrow();
  });

  it("rejects negative size", () => {
    expect(() => validateBorderOptions({ size: -1, mode: "solid" })).toThrow();
  });

  it("rejects size > 64", () => {
    expect(() => validateBorderOptions({ size: 65, mode: "solid" })).toThrow();
  });

  it("rejects invalid mode", () => {
    expect(() => validateBorderOptions({ size: 1, mode: "mirror" as any })).toThrow();
  });
});

describe("borderedSize", () => {
  it("adds border on all sides", () => {
    expect(borderedSize(16, 16, 2)).toEqual({ width: 20, height: 20 });
  });

  it("returns same size when border is 0", () => {
    expect(borderedSize(32, 16, 0)).toEqual({ width: 32, height: 16 });
  });
});

describe("applyBorder", () => {
  it("returns same frame when size is 0", () => {
    const frame = makeFrame(4, 4);
    expect(applyBorder(frame, { size: 0, mode: "clamp" })).toBe(frame);
  });

  it("increases frame dimensions", () => {
    const frame = makeFrame(4, 4);
    const result = applyBorder(frame, { size: 1, mode: "clamp" });
    expect(result.width).toBe(6);
    expect(result.height).toBe(6);
  });

  it("transparent mode sets border pixels to alpha 0", () => {
    const frame = makeFrame(2, 2);
    const result = applyBorder(frame, { size: 1, mode: "transparent" });
    // top-left corner pixel should be transparent
    expect(result.data[3]).toBe(0);
  });

  it("clamp mode copies edge pixels into border", () => {
    const frame = makeFrame(2, 2, 128);
    const result = applyBorder(frame, { size: 1, mode: "clamp" });
    // top-left corner should match the clamped source pixel
    expect(result.data[0]).toBe(128);
    expect(result.data[3]).toBe(255);
  });
});
