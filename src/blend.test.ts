import Jimp from "jimp";
import { blendPixel, applyBlend, isValidBlendMode } from "./blend";
import { parseBlendConfig, shouldApplyBlend, blendLabel } from "./blend.config";

describe("isValidBlendMode", () => {
  it("accepts known modes", () => {
    expect(isValidBlendMode("normal")).toBe(true);
    expect(isValidBlendMode("multiply")).toBe(true);
    expect(isValidBlendMode("screen")).toBe(true);
    expect(isValidBlendMode("overlay")).toBe(true);
    expect(isValidBlendMode("add")).toBe(true);
  });

  it("rejects unknown modes", () => {
    expect(isValidBlendMode("dissolve")).toBe(false);
    expect(isValidBlendMode("")).toBe(false);
  });
});

describe("blendPixel", () => {
  it("normal returns src", () => {
    expect(blendPixel(100, 200, "normal")).toBe(100);
  });

  it("multiply darkens", () => {
    const result = blendPixel(128, 128, "multiply");
    expect(result).toBeLessThan(128);
  });

  it("screen lightens", () => {
    const result = blendPixel(128, 128, "screen");
    expect(result).toBeGreaterThan(128);
  });

  it("add clamps to 255", () => {
    expect(blendPixel(200, 200, "add")).toBe(255);
  });
});

describe("applyBlend", () => {
  async function makeImage(r: number, g: number, b: number, a: number = 255) {
    const img = new Jimp(4, 4);
    img.scan(0, 0, 4, 4, function (x, y, idx) {
      this.bitmap.data[idx] = r;
      this.bitmap.data[idx + 1] = g;
      this.bitmap.data[idx + 2] = b;
      this.bitmap.data[idx + 3] = a;
    });
    return img;
  }

  it("normal mode at full opacity returns overlay color", async () => {
    const base = await makeImage(0, 0, 0, 255);
    const overlay = await makeImage(255, 0, 0, 255);
    const result = applyBlend(base, overlay, "normal", 1.0);
    const px = Jimp.intToRGBA(result.getPixelColor(0, 0));
    expect(px.r).toBe(255);
  });
});

describe("parseBlendConfig", () => {
  it("returns defaults for undefined", () => {
    const cfg = parseBlendConfig(undefined);
    expect(cfg.mode).toBe("normal");
    expect(cfg.opacity).toBe(1.0);
  });

  it("parses valid config", () => {
    const cfg = parseBlendConfig({ mode: "multiply", opacity: 0.5 });
    expect(cfg.mode).toBe("multiply");
    expect(cfg.opacity).toBe(0.5);
  });

  it("falls back on invalid values", () => {
    const cfg = parseBlendConfig({ mode: "unknown", opacity: 5 });
    expect(cfg.mode).toBe("normal");
    expect(cfg.opacity).toBe(1.0);
  });
});

describe("shouldApplyBlend", () => {
  it("false for normal at full opacity", () => {
    expect(shouldApplyBlend({ mode: "normal", opacity: 1.0 })).toBe(false);
  });

  it("true for non-normal mode", () => {
    expect(shouldApplyBlend({ mode: "screen", opacity: 1.0 })).toBe(true);
  });

  it("true for reduced opacity", () => {
    expect(shouldApplyBlend({ mode: "normal", opacity: 0.5 })).toBe(true);
  });
});

describe("blendLabel", () => {
  it("formats label correctly", () => {
    expect(blendLabel({ mode: "overlay", opacity: 0.75 })).toBe("blend:overlay@0.75");
  });
});
