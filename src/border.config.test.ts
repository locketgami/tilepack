import { parseBorderConfig, shouldApplyBorder, isValidBorderMode } from "./border.config";

describe("isValidBorderMode", () => {
  it("accepts valid modes", () => {
    expect(isValidBorderMode("solid")).toBe(true);
    expect(isValidBorderMode("clamp")).toBe(true);
    expect(isValidBorderMode("transparent")).toBe(true);
  });

  it("rejects invalid modes", () => {
    expect(isValidBorderMode("repeat")).toBe(false);
    expect(isValidBorderMode("")).toBe(false);
  });
});

describe("parseBorderConfig", () => {
  it("returns null for null/undefined/false", () => {
    expect(parseBorderConfig(null)).toBeNull();
    expect(parseBorderConfig(undefined)).toBeNull();
    expect(parseBorderConfig(false)).toBeNull();
  });

  it("returns defaults for empty object", () => {
    const result = parseBorderConfig({});
    expect(result).toEqual({ size: 1, mode: "clamp" });
  });

  it("parses explicit size and mode", () => {
    expect(parseBorderConfig({ size: 4, mode: "solid" })).toEqual({ size: 4, mode: "solid" });
  });

  it("throws on invalid mode", () => {
    expect(() => parseBorderConfig({ size: 2, mode: "mirror" })).toThrow(/Invalid border mode/);
  });

  it("throws on negative size", () => {
    expect(() => parseBorderConfig({ size: -1, mode: "clamp" })).toThrow(/non-negative integer/);
  });
});

describe("shouldApplyBorder", () => {
  it("returns false for null", () => {
    expect(shouldApplyBorder(null)).toBe(false);
  });

  it("returns false when size is 0", () => {
    expect(shouldApplyBorder({ size: 0, mode: "clamp" })).toBe(false);
  });

  it("returns true for valid non-zero config", () => {
    expect(shouldApplyBorder({ size: 2, mode: "transparent" })).toBe(true);
  });
});
