import { describe, it, expect } from "vitest";
import {
  isValidTintStrength,
  validateTintStrength,
  parseTintColor,
  applyTint,
  tintLabel,
} from "./tint";
import { parseTintConfig, shouldApplyTint, tintConfigLabel } from "./tint.config";

function makeFrame(r: number, g: number, b: number, a = 255) {
  const data = Buffer.from([r, g, b, a]);
  return { width: 1, height: 1, data };
}

describe("isValidTintStrength", () => {
  it("accepts 0 and 1", () => {
    expect(isValidTintStrength(0)).toBe(true);
    expect(isValidTintStrength(1)).toBe(true);
  });
  it("rejects out of range", () => {
    expect(isValidTintStrength(-0.1)).toBe(false);
    expect(isValidTintStrength(1.1)).toBe(false);
  });
  it("rejects NaN", () => {
    expect(isValidTintStrength(NaN)).toBe(false);
  });
});

describe("validateTintStrength", () => {
  it("throws on invalid strength", () => {
    expect(() => validateTintStrength(2)).toThrow(RangeError);
  });
});

describe("parseTintColor", () => {
  it("parses a valid hex color", () => {
    expect(parseTintColor("#ff8000")).toEqual({ r: 255, g: 128, b: 0 });
  });
  it("parses without leading #", () => {
    expect(parseTintColor("00ff00")).toEqual({ r: 0, g: 255, b: 0 });
  });
  it("throws on invalid format", () => {
    expect(() => parseTintColor("#xyz")).toThrow();
  });
});

describe("applyTint", () => {
  it("blends pixel toward tint color", () => {
    const frame = makeFrame(0, 0, 0);
    const result = applyTint(frame, { r: 255, g: 0, b: 0 }, 1.0);
    expect(result.data[0]).toBe(255);
    expect(result.data[1]).toBe(0);
    expect(result.data[2]).toBe(0);
    expect(result.data[3]).toBe(255);
  });
  it("preserves alpha channel", () => {
    const frame = makeFrame(100, 100, 100, 128);
    const result = applyTint(frame, { r: 0, g: 0, b: 0 }, 0.5);
    expect(result.data[3]).toBe(128);
  });
  it("does not mutate original frame data", () => {
    const frame = makeFrame(200, 200, 200);
    const original = Buffer.from(frame.data);
    applyTint(frame, { r: 0, g: 0, b: 255 }, 0.5);
    expect(frame.data).toEqual(original);
  });
});

describe("tintLabel", () => {
  it("formats label correctly", () => {
    expect(tintLabel({ r: 255, g: 0, b: 0 }, 0.5)).toBe("tint(#ff0000, 0.5)");
  });
});

describe("parseTintConfig", () => {
  it("parses valid config", () => {
    const cfg = parseTintConfig({ tintColor: "#aabbcc", tintStrength: 0.3 });
    expect(cfg.color).toEqual({ r: 170, g: 187, b: 204 });
    expect(cfg.strength).toBe(0.3);
  });
  it("defaults strength to 0.5", () => {
    const cfg = parseTintConfig({ tintColor: "#ffffff" });
    expect(cfg.strength).toBe(0.5);
  });
  it("throws if tintColor missing", () => {
    expect(() => parseTintConfig({ tintStrength: 0.5 })).toThrow();
  });
});

describe("shouldApplyTint", () => {
  it("returns true when tintColor present", () => {
    expect(shouldApplyTint({ tintColor: "#ff0000" })).toBe(true);
  });
  it("returns false when absent", () => {
    expect(shouldApplyTint({})).toBe(false);
  });
});

describe("tintConfigLabel", () => {
  it("formats label", () => {
    const label = tintConfigLabel({ color: { r: 0, g: 255, b: 0 }, strength: 0.8 });
    expect(label).toBe("tint(#00ff00 @ 0.8)");
  });
});
