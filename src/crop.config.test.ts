import { parseCropConfig, shouldApplyCrop, defaultCropConfig } from "./crop.config";

describe("parseCropConfig", () => {
  it("returns defaults when called with empty object", () => {
    const config = parseCropConfig({});
    expect(config).toEqual(defaultCropConfig);
  });

  it("overrides individual fields", () => {
    const config = parseCropConfig({ enabled: false, padding: 2 });
    expect(config.enabled).toBe(false);
    expect(config.padding).toBe(2);
    expect(config.minSavingThreshold).toBe(0);
  });

  it("throws on negative minSavingThreshold", () => {
    expect(() => parseCropConfig({ minSavingThreshold: -1 })).toThrow(
      /minSavingThreshold/
    );
  });

  it("throws on negative padding", () => {
    expect(() => parseCropConfig({ padding: -5 })).toThrow(/padding/);
  });

  it("accepts zero values", () => {
    const config = parseCropConfig({ padding: 0, minSavingThreshold: 0 });
    expect(config.padding).toBe(0);
    expect(config.minSavingThreshold).toBe(0);
  });
});

describe("shouldApplyCrop", () => {
  it("returns false when disabled", () => {
    const config = parseCropConfig({ enabled: false });
    expect(shouldApplyCrop(config, 1000)).toBe(false);
  });

  it("returns true when enabled and saving meets threshold", () => {
    const config = parseCropConfig({ enabled: true, minSavingThreshold: 100 });
    expect(shouldApplyCrop(config, 100)).toBe(true);
  });

  it("returns false when saving is below threshold", () => {
    const config = parseCropConfig({ enabled: true, minSavingThreshold: 200 });
    expect(shouldApplyCrop(config, 100)).toBe(false);
  });

  it("returns true with default config and any positive saving", () => {
    const config = parseCropConfig({});
    expect(shouldApplyCrop(config, 1)).toBe(true);
  });
});
