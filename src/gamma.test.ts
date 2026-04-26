import Jimp from "jimp";
import {
  isValidGamma,
  validateGamma,
  applyGamma,
  gammaLabel,
  GAMMA_MIN,
  GAMMA_MAX,
} from "./gamma";
import { parseGammaConfig, shouldApplyGamma, defaultGammaConfig } from "./gamma.config";

describe("isValidGamma", () => {
  it("accepts values in range", () => {
    expect(isValidGamma(1.0)).toBe(true);
    expect(isValidGamma(GAMMA_MIN)).toBe(true);
    expect(isValidGamma(GAMMA_MAX)).toBe(true);
    expect(isValidGamma(2.2)).toBe(true);
  });

  it("rejects out-of-range values", () => {
    expect(isValidGamma(0)).toBe(false);
    expect(isValidGamma(-1)).toBe(false);
    expect(isValidGamma(GAMMA_MAX + 1)).toBe(false);
    expect(isValidGamma(NaN)).toBe(false);
  });
});

describe("validateGamma", () => {
  it("throws on invalid gamma", () => {
    expect(() => validateGamma(0)).toThrow(RangeError);
    expect(() => validateGamma(999)).toThrow(RangeError);
  });

  it("does not throw on valid gamma", () => {
    expect(() => validateGamma(1.0)).not.toThrow();
  });
});

describe("applyGamma", () => {
  async function makeImage(r: number, g: number, b: number): Promise<Jimp> {
    const img = new Jimp(2, 2, 0x000000ff);
    img.scan(0, 0, 2, 2, function (_x, _y, idx) {
      this.bitmap.data[idx] = r;
      this.bitmap.data[idx + 1] = g;
      this.bitmap.data[idx + 2] = b;
      this.bitmap.data[idx + 3] = 255;
    });
    return img;
  }

  it("gamma 1.0 leaves pixels unchanged", async () => {
    const img = await makeImage(128, 64, 200);
    applyGamma(img, 1.0);
    expect(img.bitmap.data[0]).toBe(128);
    expect(img.bitmap.data[1]).toBe(64);
    expect(img.bitmap.data[2]).toBe(200);
  });

  it("brightens with gamma > 1", async () => {
    const img = await makeImage(100, 100, 100);
    applyGamma(img, 2.2);
    expect(img.bitmap.data[0]).toBeGreaterThan(100);
  });

  it("darkens with gamma < 1", async () => {
    const img = await makeImage(200, 200, 200);
    applyGamma(img, 0.5);
    expect(img.bitmap.data[0]).toBeLessThan(200);
  });

  it("does not modify alpha channel", async () => {
    const img = await makeImage(128, 128, 128);
    applyGamma(img, 2.0);
    expect(img.bitmap.data[3]).toBe(255);
  });
});

describe("gammaLabel", () => {
  it("formats label correctly", () => {
    expect(gammaLabel(2.2)).toBe("gamma(2.20)");
    expect(gammaLabel(1.0)).toBe("gamma(1.00)");
  });
});

describe("parseGammaConfig", () => {
  it("returns default when key missing", () => {
    expect(parseGammaConfig({})).toEqual(defaultGammaConfig);
  });

  it("parses numeric shorthand", () => {
    expect(parseGammaConfig({ gamma: 2.2 })).toEqual({ enabled: true, value: 2.2 });
  });

  it("parses object form", () => {
    expect(parseGammaConfig({ gamma: { value: 1.8, enabled: true } })).toEqual({
      enabled: true,
      value: 1.8,
    });
  });

  it("throws on invalid value", () => {
    expect(() => parseGammaConfig({ gamma: 0 })).toThrow(RangeError);
  });
});

describe("shouldApplyGamma", () => {
  it("returns false when disabled", () => {
    expect(shouldApplyGamma({ enabled: false, value: 2.2 })).toBe(false);
  });

  it("returns false when value is 1.0 (identity)", () => {
    expect(shouldApplyGamma({ enabled: true, value: 1.0 })).toBe(false);
  });

  it("returns true when enabled and non-identity", () => {
    expect(shouldApplyGamma({ enabled: true, value: 2.2 })).toBe(true);
  });
});
