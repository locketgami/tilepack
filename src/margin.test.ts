import { describe, it, expect } from "vitest";
import {
  validateMarginOptions,
  totalBorder,
  innerRect,
  paddedSize,
  defaultMarginOptions,
} from "./margin";

describe("validateMarginOptions", () => {
  it("accepts valid options", () => {
    expect(() => validateMarginOptions({ padding: 2, extrude: 1 })).not.toThrow();
  });

  it("accepts zero values", () => {
    expect(() => validateMarginOptions({ padding: 0, extrude: 0 })).not.toThrow();
  });

  it("rejects negative padding", () => {
    expect(() => validateMarginOptions({ padding: -1, extrude: 0 })).toThrow(/padding/);
  });

  it("rejects negative extrude", () => {
    expect(() => validateMarginOptions({ padding: 0, extrude: -2 })).toThrow(/extrude/);
  });

  it("rejects fractional padding", () => {
    expect(() => validateMarginOptions({ padding: 1.5, extrude: 0 })).toThrow(/padding/);
  });
});

describe("totalBorder", () => {
  it("sums padding and extrude", () => {
    expect(totalBorder({ padding: 2, extrude: 1 })).toBe(3);
  });

  it("returns 0 when both are 0", () => {
    expect(totalBorder({ padding: 0, extrude: 0 })).toBe(0);
  });

  it("matches default options", () => {
    expect(totalBorder(defaultMarginOptions)).toBe(1);
  });
});

describe("innerRect", () => {
  it("shrinks rect by border on all sides", () => {
    const result = innerRect(0, 0, 20, 20, { padding: 2, extrude: 0 });
    expect(result).toEqual({ x: 2, y: 2, w: 16, h: 16 });
  });

  it("accounts for both padding and extrude", () => {
    const result = innerRect(10, 10, 30, 30, { padding: 1, extrude: 2 });
    expect(result).toEqual({ x: 13, y: 13, w: 24, h: 24 });
  });
});

describe("paddedSize", () => {
  it("adds border on each side", () => {
    expect(paddedSize(16, 16, { padding: 2, extrude: 0 })).toEqual({ w: 20, h: 20 });
  });

  it("handles non-square frames", () => {
    expect(paddedSize(32, 16, { padding: 1, extrude: 1 })).toEqual({ w: 36, h: 20 });
  });

  it("no change when border is 0", () => {
    expect(paddedSize(8, 8, { padding: 0, extrude: 0 })).toEqual({ w: 8, h: 8 });
  });
});
