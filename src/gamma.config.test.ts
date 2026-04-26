import { describe, it, expect } from "vitest";
import { parseGammaConfig, shouldApplyGamma } from "./gamma.config";

describe("parseGammaConfig", () => {
  it("returns default config when no options provided", () => {
    const config = parseGammaConfig({});
    expect(config.enabled).toBe(false);
    expect(config.gamma).toBeUndefined();
  });

  it("parses gamma value from number", () => {
    const config = parseGammaConfig({ gamma: 2.2 });
    expect(config.enabled).toBe(true);
    expect(config.gamma).toBe(2.2);
  });

  it("parses gamma value from string", () => {
    const config = parseGammaConfig({ gamma: "1.8" });
    expect(config.enabled).toBe(true);
    expect(config.gamma).toBe(1.8);
  });

  it("throws on invalid gamma string", () => {
    expect(() => parseGammaConfig({ gamma: "bad" })).toThrow();
  });

  it("throws on gamma out of range", () => {
    expect(() => parseGammaConfig({ gamma: 0 })).toThrow();
    expect(() => parseGammaConfig({ gamma: -1 })).toThrow();
    expect(() => parseGammaConfig({ gamma: 10 })).toThrow();
  });

  it("accepts gamma at boundary values", () => {
    expect(parseGammaConfig({ gamma: 0.1 }).gamma).toBe(0.1);
    expect(parseGammaConfig({ gamma: 9.9 }).gamma).toBe(9.9);
  });

  it("sets enabled to false when gamma is explicitly disabled", () => {
    const config = parseGammaConfig({ gamma: 2.2, gammaEnabled: false });
    expect(config.enabled).toBe(false);
  });
});

describe("shouldApplyGamma", () => {
  it("returns false when config is disabled", () => {
    expect(shouldApplyGamma({ enabled: false, gamma: 2.2 })).toBe(false);
  });

  it("returns false when gamma is undefined", () => {
    expect(shouldApplyGamma({ enabled: true, gamma: undefined })).toBe(false);
  });

  it("returns false when gamma equals 1 (identity)", () => {
    expect(shouldApplyGamma({ enabled: true, gamma: 1.0 })).toBe(false);
  });

  it("returns true when enabled with a valid non-identity gamma", () => {
    expect(shouldApplyGamma({ enabled: true, gamma: 2.2 })).toBe(true);
    expect(shouldApplyGamma({ enabled: true, gamma: 0.5 })).toBe(true);
  });
});
