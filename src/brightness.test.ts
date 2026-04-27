import Jimp from "jimp";
import {
  isValidBrightness,
  validateBrightness,
  applyBrightness,
  applyContrast,
  brightnessLabel,
} from "./brightness";

async function makeFrame(width = 4, height = 4) {
  const image = await Jimp.create(width, height, 0xff8844ff);
  return { image, name: "test" };
}

describe("isValidBrightness", () => {
  it("accepts values in [-1, 1]", () => {
    expect(isValidBrightness(0)).toBe(true);
    expect(isValidBrightness(1)).toBe(true);
    expect(isValidBrightness(-1)).toBe(true);
    expect(isValidBrightness(0.5)).toBe(true);
  });

  it("rejects out-of-range values", () => {
    expect(isValidBrightness(1.1)).toBe(false);
    expect(isValidBrightness(-2)).toBe(false);
    expect(isValidBrightness(NaN)).toBe(false);
    expect(isValidBrightness(Infinity)).toBe(false);
  });
});

describe("validateBrightness", () => {
  it("throws for invalid values", () => {
    expect(() => validateBrightness(2)).toThrow(RangeError);
    expect(() => validateBrightness(-1.5)).toThrow(RangeError);
  });

  it("does not throw for valid values", () => {
    expect(() => validateBrightness(0)).not.toThrow();
    expect(() => validateBrightness(-0.5)).not.toThrow();
  });
});

describe("applyBrightness", () => {
  it("returns the same frame reference when amount is 0", async () => {
    const frame = await makeFrame();
    const result = applyBrightness(frame, 0);
    expect(result).toBe(frame);
  });

  it("returns a new frame when amount is non-zero", async () => {
    const frame = await makeFrame();
    const result = applyBrightness(frame, 0.3);
    expect(result).not.toBe(frame);
    expect(result.name).toBe(frame.name);
  });

  it("throws for invalid brightness", async () => {
    const frame = await makeFrame();
    expect(() => applyBrightness(frame, 5)).toThrow(RangeError);
  });
});

describe("applyContrast", () => {
  it("returns the same frame reference when amount is 0", async () => {
    const frame = await makeFrame();
    const result = applyContrast(frame, 0);
    expect(result).toBe(frame);
  });

  it("returns a new frame when amount is non-zero", async () => {
    const frame = await makeFrame();
    const result = applyContrast(frame, -0.2);
    expect(result).not.toBe(frame);
  });
});

describe("brightnessLabel", () => {
  it("returns none label when both are 0", () => {
    expect(brightnessLabel(0, 0)).toBe("brightness(none)");
  });

  it("includes brightness part", () => {
    expect(brightnessLabel(0.5, 0)).toBe("brightness(+0.5)");
  });

  it("includes contrast part", () => {
    expect(brightnessLabel(0, -0.3)).toBe("contrast(-0.3)");
  });

  it("includes both parts", () => {
    expect(brightnessLabel(0.2, 0.1)).toBe("brightness(+0.2) contrast(+0.1)");
  });
});
