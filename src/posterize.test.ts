import Jimp from "jimp";
import {
  isValidPosterizeLevel,
  validatePosterizeLevel,
  posterizeChannel,
  applyPosterize,
  posterizeLabel,
} from "./posterize";
import {
  parsePosterizeConfig,
  shouldApplyPosterize,
  defaultPosterizeConfig,
} from "./posterize.config";

describe("isValidPosterizeLevel", () => {
  it("accepts valid levels", () => {
    expect(isValidPosterizeLevel(2)).toBe(true);
    expect(isValidPosterizeLevel(4)).toBe(true);
    expect(isValidPosterizeLevel(255)).toBe(true);
  });

  it("rejects out-of-range levels", () => {
    expect(isValidPosterizeLevel(1)).toBe(false);
    expect(isValidPosterizeLevel(256)).toBe(false);
    expect(isValidPosterizeLevel(0)).toBe(false);
  });

  it("rejects non-integers", () => {
    expect(isValidPosterizeLevel(2.5)).toBe(false);
  });
});

describe("validatePosterizeLevel", () => {
  it("throws on invalid level", () => {
    expect(() => validatePosterizeLevel(1)).toThrow(RangeError);
  });

  it("does not throw on valid level", () => {
    expect(() => validatePosterizeLevel(4)).not.toThrow();
  });
});

describe("posterizeChannel", () => {
  it("maps 0 to 0 with any level", () => {
    expect(posterizeChannel(0, 4)).toBe(0);
  });

  it("maps 255 to 255 with any level", () => {
    expect(posterizeChannel(255, 4)).toBe(255);
  });

  it("quantizes mid values", () => {
    const result = posterizeChannel(100, 4);
    expect([0, 85, 170, 255]).toContain(result);
  });
});

describe("applyPosterize", () => {
  it("returns a new Jimp instance", async () => {
    const img = await Jimp.create(4, 4, 0xff0000ff);
    const result = applyPosterize(img, 4);
    expect(result).not.toBe(img);
  });

  it("throws on invalid level", async () => {
    const img = await Jimp.create(2, 2, 0x000000ff);
    expect(() => applyPosterize(img, 1)).toThrow(RangeError);
  });
});

describe("posterizeLabel", () => {
  it("formats label correctly", () => {
    expect(posterizeLabel(4)).toBe("posterize(4)");
  });
});

describe("parsePosterizeConfig", () => {
  it("returns defaults when undefined", () => {
    expect(parsePosterizeConfig(undefined)).toEqual(defaultPosterizeConfig);
  });

  it("parses enabled and levels", () => {
    const cfg = parsePosterizeConfig({ enabled: true, levels: 8 });
    expect(cfg.enabled).toBe(true);
    expect(cfg.levels).toBe(8);
  });

  it("throws on invalid levels value", () => {
    expect(() => parsePosterizeConfig({ enabled: true, levels: 1 })).toThrow(RangeError);
  });
});

describe("shouldApplyPosterize", () => {
  it("returns false when disabled", () => {
    expect(shouldApplyPosterize({ enabled: false, levels: 4 })).toBe(false);
  });

  it("returns true when enabled with valid levels", () => {
    expect(shouldApplyPosterize({ enabled: true, levels: 4 })).toBe(true);
  });
});
