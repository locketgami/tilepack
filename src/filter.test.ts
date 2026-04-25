import { describe, it, expect } from "vitest";
import {
  isValidFilterMode,
  resolveKernel,
  defaultFilterOptions,
} from "./filter";

describe("isValidFilterMode", () => {
  it("accepts valid modes", () => {
    for (const mode of ["nearest", "linear", "cubic", "lanczos"]) {
      expect(isValidFilterMode(mode)).toBe(true);
    }
  });

  it("rejects invalid modes", () => {
    expect(isValidFilterMode("")).toBe(false);
    expect(isValidFilterMode("bilinear")).toBe(false);
    expect(isValidFilterMode("box")).toBe(false);
  });
});

describe("resolveKernel", () => {
  it("maps nearest to nearest", () => {
    expect(resolveKernel("nearest")).toBe("nearest");
  });

  it("maps lanczos to lanczos3", () => {
    expect(resolveKernel("lanczos")).toBe("lanczos3");
  });

  it("maps linear to linear", () => {
    expect(resolveKernel("linear")).toBe("linear");
  });

  it("maps cubic to cubic", () => {
    expect(resolveKernel("cubic")).toBe("cubic");
  });
});

describe("defaultFilterOptions", () => {
  it("returns linear mode", () => {
    const opts = defaultFilterOptions();
    expect(opts.mode).toBe("linear");
    expect(opts.sharpness).toBeUndefined();
  });
});
