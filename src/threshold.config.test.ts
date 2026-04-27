import {
  parseThresholdConfig,
  shouldApplyThreshold,
  thresholdConfigLabel,
  defaultThresholdConfig,
} from "./threshold.config";

describe("parseThresholdConfig", () => {
  it("uses defaults when fields are missing", () => {
    const cfg = parseThresholdConfig({});
    expect(cfg.threshold).toBe(defaultThresholdConfig.threshold);
    expect(cfg.replace).toBe(defaultThresholdConfig.replace);
  });

  it("reads threshold value", () => {
    const cfg = parseThresholdConfig({ threshold: 64 });
    expect(cfg.threshold).toBe(64);
  });

  it("reads replace flag", () => {
    const cfg = parseThresholdConfig({ threshold: 100, replace: true });
    expect(cfg.replace).toBe(true);
  });

  it("ignores non-boolean replace", () => {
    const cfg = parseThresholdConfig({ threshold: 100, replace: "yes" });
    expect(cfg.replace).toBe(false);
  });
});

describe("shouldApplyThreshold", () => {
  it("returns false when undefined", () => {
    expect(shouldApplyThreshold(undefined)).toBe(false);
  });

  it("returns false when threshold key missing", () => {
    expect(shouldApplyThreshold({ replace: true })).toBe(false);
  });

  it("returns true when threshold key present", () => {
    expect(shouldApplyThreshold({ threshold: 128 })).toBe(true);
  });
});

describe("thresholdConfigLabel", () => {
  it("includes threshold value", () => {
    const label = thresholdConfigLabel({ threshold: 128, replace: false });
    expect(label).toContain("128");
  });

  it("includes replace when true", () => {
    const label = thresholdConfigLabel({ threshold: 64, replace: true });
    expect(label).toContain("replace=true");
  });

  it("omits replace when false", () => {
    const label = thresholdConfigLabel({ threshold: 64, replace: false });
    expect(label).not.toContain("replace");
  });
});
