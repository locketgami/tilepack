import { describe, it, expect } from "vitest";
import { parseFilterConfig, shouldApplyFilter, filterLabel } from "./filter.config";

describe("parseFilterConfig", () => {
  it("returns linear mode by default", () => {
    expect(parseFilterConfig({}).mode).toBe("linear");
  });

  it("parses a valid filter mode", () => {
    expect(parseFilterConfig({ filter: "cubic" }).mode).toBe("cubic");
  });

  it("falls back to linear for unknown mode", () => {
    expect(parseFilterConfig({ filter: "unknown" }).mode).toBe("linear");
  });

  it("clamps sharpness to 0–3", () => {
    expect(parseFilterConfig({ sharpness: -1 }).sharpness).toBe(0);
    expect(parseFilterConfig({ sharpness: 99 }).sharpness).toBe(3);
    expect(parseFilterConfig({ sharpness: 2 }).sharpness).toBe(2);
  });

  it("omits sharpness when not provided", () => {
    expect(parseFilterConfig({ filter: "lanczos" }).sharpness).toBeUndefined();
  });
});

describe("shouldApplyFilter", () => {
  it("returns false for nearest", () => {
    expect(shouldApplyFilter({ mode: "nearest" })).toBe(false);
  });

  it("returns true for linear", () => {
    expect(shouldApplyFilter({ mode: "linear" })).toBe(true);
  });
});

describe("filterLabel", () => {
  it("returns mode name for simple modes", () => {
    expect(filterLabel({ mode: "cubic" })).toBe("cubic");
  });

  it("includes sharpness for lanczos", () => {
    expect(filterLabel({ mode: "lanczos", sharpness: 2 })).toBe("lanczos (sharpness=2)");
  });

  it("omits sharpness annotation when not set", () => {
    expect(filterLabel({ mode: "lanczos" })).toBe("lanczos");
  });
});
