import {
  parseScaleConfig,
  defaultScaleConfig,
  isValidMode,
  allScaleFactors,
} from "./scale.config";

describe("parseScaleConfig", () => {
  it("returns defaults when called with undefined", () => {
    expect(parseScaleConfig(undefined)).toEqual(defaultScaleConfig);
  });

  it("merges partial config with defaults", () => {
    const result = parseScaleConfig({ factor: 2 });
    expect(result.factor).toBe(2);
    expect(result.mode).toBe("nearest");
    expect(result.variants).toEqual([]);
  });

  it("accepts all valid modes", () => {
    expect(() => parseScaleConfig({ mode: "nearest" })).not.toThrow();
    expect(() => parseScaleConfig({ mode: "bilinear" })).not.toThrow();
    expect(() => parseScaleConfig({ mode: "bicubic" })).not.toThrow();
  });

  it("throws on invalid mode", () => {
    expect(() =>
      parseScaleConfig({ mode: "lanczos" as any })
    ).toThrow("Invalid scale mode");
  });

  it("handles variants array", () => {
    const result = parseScaleConfig({ factor: 1, variants: [0.5, 2, 4] });
    expect(result.variants).toEqual([0.5, 2, 4]);
  });

  it("ignores non-array variants", () => {
    const result = parseScaleConfig({ variants: "bad" as any });
    expect(result.variants).toEqual([]);
  });
});

describe("isValidMode", () => {
  it("returns true for valid modes", () => {
    expect(isValidMode("nearest")).toBe(true);
    expect(isValidMode("bilinear")).toBe(true);
    expect(isValidMode("bicubic")).toBe(true);
  });

  it("returns false for invalid modes", () => {
    expect(isValidMode("lanczos")).toBe(false);
    expect(isValidMode("")).toBe(false);
  });
});

describe("allScaleFactors", () => {
  it("returns sorted unique factors including base", () => {
    const result = allScaleFactors({ factor: 1, mode: "nearest", variants: [4, 2] });
    expect(result).toEqual([1, 2, 4]);
  });

  it("deduplicates when base is also in variants", () => {
    const result = allScaleFactors({ factor: 2, mode: "nearest", variants: [2, 4] });
    expect(result).toEqual([2, 4]);
  });

  it("returns single factor when no variants", () => {
    const result = allScaleFactors({ factor: 1, mode: "nearest", variants: [] });
    expect(result).toEqual([1]);
  });
});
