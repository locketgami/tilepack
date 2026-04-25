import Jimp from "jimp";
import {
  isValidFlipAxis,
  parseFlipAxis,
  flipFrame,
  flipFrames,
  flipLabel,
  Frame,
} from "./flip";

async function makeFrame(width = 4, height = 4): Promise<Frame> {
  const image = new Jimp(width, height, 0x00000000);
  // paint top-left pixel red so flips are detectable
  image.setPixelColor(0xff0000ff, 0, 0);
  return { image, name: "test", width, height };
}

describe("isValidFlipAxis", () => {
  it("accepts valid axes", () => {
    expect(isValidFlipAxis("horizontal")).toBe(true);
    expect(isValidFlipAxis("vertical")).toBe(true);
    expect(isValidFlipAxis("both")).toBe(true);
  });

  it("rejects invalid values", () => {
    expect(isValidFlipAxis("diagonal")).toBe(false);
    expect(isValidFlipAxis("")).toBe(false);
  });
});

describe("parseFlipAxis", () => {
  it("returns valid axis", () => {
    expect(parseFlipAxis("horizontal")).toBe("horizontal");
    expect(parseFlipAxis("vertical")).toBe("vertical");
    expect(parseFlipAxis("both")).toBe("both");
  });

  it("throws on invalid input", () => {
    expect(() => parseFlipAxis("none")).toThrow(/Invalid flip axis/);
    expect(() => parseFlipAxis(42)).toThrow(/Invalid flip axis/);
  });
});

describe("flipFrame", () => {
  it("flips horizontally — top-left pixel moves to top-right", async () => {
    const frame = await makeFrame(4, 4);
    const result = flipFrame(frame, { axis: "horizontal" });
    expect(result.image.getPixelColor(3, 0)).toBe(0xff0000ff);
    expect(result.image.getPixelColor(0, 0)).toBe(0x00000000);
  });

  it("flips vertically — top-left pixel moves to bottom-left", async () => {
    const frame = await makeFrame(4, 4);
    const result = flipFrame(frame, { axis: "vertical" });
    expect(result.image.getPixelColor(0, 3)).toBe(0xff0000ff);
    expect(result.image.getPixelColor(0, 0)).toBe(0x00000000);
  });

  it("flips both axes — top-left moves to bottom-right", async () => {
    const frame = await makeFrame(4, 4);
    const result = flipFrame(frame, { axis: "both" });
    expect(result.image.getPixelColor(3, 3)).toBe(0xff0000ff);
    expect(result.image.getPixelColor(0, 0)).toBe(0x00000000);
  });

  it("does not mutate the original frame", async () => {
    const frame = await makeFrame(4, 4);
    flipFrame(frame, { axis: "horizontal" });
    expect(frame.image.getPixelColor(0, 0)).toBe(0xff0000ff);
  });
});

describe("flipFrames", () => {
  it("applies flip to every frame", async () => {
    const frames = [await makeFrame(), await makeFrame()];
    const results = flipFrames(frames, { axis: "horizontal" });
    expect(results).toHaveLength(2);
    results.forEach((r) => {
      expect(r.image.getPixelColor(3, 0)).toBe(0xff0000ff);
    });
  });
});

describe("flipLabel", () => {
  it("returns a readable label", () => {
    expect(flipLabel({ axis: "horizontal" })).toBe("flip:horizontal");
    expect(flipLabel({ axis: "both" })).toBe("flip:both");
  });
});
