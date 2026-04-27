import { describe, it, expect } from "vitest";
import {
  parseBrightnessConfig,
  shouldApplyBrightness,
  brightnessConfigLabel,
  defaultBrightnessConfig,
} from "./brightness.config";

describe("parseBrightnessConfig", () => {
  it("returns defaults when given undefined", () => {
    expect(parseBrightnessConfig(undefined)).toEqual(defaultBrightnessConfig);
  });

  it("parses brightness and contrast values", () => {
    const result = parseBrightnessConfig({ brightness: 0.3, contrast: -0.2 });
    expect(result.brightness).toBeCloseTo(0.3);
    expect(result.contrast).toBeCloseTo(-0.2);
  });

  it("defaults missing fields to 0", () => {
    const result = parseBrightnessConfig({ brightness: 0.5 });
    expect(result.brightness).toBeCloseTo(0.5);
    expect(result.contrast).toBe(0);
  });

  it("ignores non-numeric values", () => {
    const result = parseBrightnessConfig({ brightness: "high", contrast: null });
    expect(result.brightness).toBe(0);
    expect(result.contrast).toBe(0);
  });
});

describe("shouldApplyBrightness", () => {
  it("returns false when both values are 0", () => {
    expect(shouldApplyBrightness({ brightness: 0, contrast: 0 })).toBe(false);
  });

  it("returns true when brightness is non-zero", () => {
    expect(shouldApplyBrightness({ brightness: 0.1, contrast: 0 })).toBe(true);
  });

  it("returns true when contrast is non-zero", () => {
    expect(shouldApplyBrightness({ brightness: 0, contrast: -0.5 })).toBe(true);
  });
});

describe("brightnessConfigLabel", () => {
  it("returns no-op when both are 0", () => {
    expect(brightnessConfigLabel({ brightness: 0, contrast: 0 })).toBe("no-op");
  });

  it("formats positive brightness with + sign", () => {
    const label = brightnessConfigLabel({ brightness: 0.25, contrast: 0 });
    expect(label).toBe("brightness=+0.25");
  });

  it("formats negative contrast without + sign", () => {
    const label = brightnessConfigLabel({ brightness: 0, contrast: -0.1 });
    expect(label).toBe("contrast=-0.1");
  });

  it("includes both when both are set", () => {
    const label = brightnessConfigLabel({ brightness: 0.5, contrast: 0.2 });
    expect(label).toContain("brightness=+0.5");
    expect(label).toContain("contrast=+0.2");
  });
});
