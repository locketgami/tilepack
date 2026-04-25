import { describe, it, expect } from "vitest";
import { reorderFrames, reorderLabel, isValidReorderMode } from "./reorder";
import { parseReorderConfig, shouldApplyReorder, defaultReorderConfig } from "./reorder.config";

function makeFrames() {
  return [
    { name: "banana", w: 32, h: 64 },
    { name: "apple",  w: 64, h: 64 },
    { name: "cherry", w: 16, h: 16 },
  ];
}

describe("isValidReorderMode", () => {
  it("accepts valid modes", () => {
    for (const m of ["none", "name", "area", "width", "height"]) {
      expect(isValidReorderMode(m)).toBe(true);
    }
  });
  it("rejects unknown modes", () => {
    expect(isValidReorderMode("random")).toBe(false);
  });
});

describe("reorderFrames", () => {
  it("none returns copy in original order", () => {
    const frames = makeFrames();
    const result = reorderFrames(frames, { mode: "none" });
    expect(result.map(f => f.name)).toEqual(["banana", "apple", "cherry"]);
  });

  it("sorts by name ascending", () => {
    const result = reorderFrames(makeFrames(), { mode: "name" });
    expect(result.map(f => f.name)).toEqual(["apple", "banana", "cherry"]);
  });

  it("sorts by name descending", () => {
    const result = reorderFrames(makeFrames(), { mode: "name", descending: true });
    expect(result.map(f => f.name)).toEqual(["cherry", "banana", "apple"]);
  });

  it("sorts by area ascending", () => {
    const result = reorderFrames(makeFrames(), { mode: "area" });
    // cherry=256, banana=2048, apple=4096
    expect(result.map(f => f.name)).toEqual(["cherry", "banana", "apple"]);
  });

  it("sorts by width descending", () => {
    const result = reorderFrames(makeFrames(), { mode: "width", descending: true });
    expect(result[0].name).toBe("apple");
    expect(result[2].name).toBe("cherry");
  });

  it("does not mutate original array", () => {
    const frames = makeFrames();
    reorderFrames(frames, { mode: "name" });
    expect(frames[0].name).toBe("banana");
  });
});

describe("reorderLabel", () => {
  it("returns none label", () => {
    expect(reorderLabel({ mode: "none" })).toBe("reorder:none");
  });
  it("includes direction", () => {
    expect(reorderLabel({ mode: "area", descending: false })).toBe("reorder:area:asc");
    expect(reorderLabel({ mode: "area", descending: true })).toBe("reorder:area:desc");
  });
});

describe("parseReorderConfig", () => {
  it("defaults to none", () => {
    expect(parseReorderConfig({}).mode).toBe("none");
  });
  it("parses valid mode", () => {
    expect(parseReorderConfig({ mode: "height" }).mode).toBe("height");
  });
  it("throws on invalid mode", () => {
    expect(() => parseReorderConfig({ mode: "zigzag" })).toThrow();
  });
  it("shouldApplyReorder is false for none", () => {
    expect(shouldApplyReorder(defaultReorderConfig())).toBe(false);
  });
  it("shouldApplyReorder is true for name", () => {
    expect(shouldApplyReorder({ mode: "name" })).toBe(true);
  });
});
