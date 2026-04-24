import { describe, it, expect } from "vitest";
import { dedupeFrames, resolveAlias, Frame } from "./dedupe";

function makeFrame(name: string, fill: number, width = 16, height = 16): Frame {
  const data = Buffer.alloc(width * height * 4, fill);
  return { name, data, width, height };
}

describe("dedupeFrames", () => {
  it("returns all frames when all are unique", () => {
    const frames = [makeFrame("a", 1), makeFrame("b", 2), makeFrame("c", 3)];
    const { unique, aliases } = dedupeFrames(frames);
    expect(unique).toHaveLength(3);
    expect(aliases.size).toBe(0);
  });

  it("detects duplicate frames and creates aliases", () => {
    const frames = [
      makeFrame("walk_01", 42),
      makeFrame("walk_02", 99),
      makeFrame("idle_01", 42), // duplicate of walk_01
    ];
    const { unique, aliases } = dedupeFrames(frames);
    expect(unique).toHaveLength(2);
    expect(aliases.get("idle_01")).toBe("walk_01");
  });

  it("handles all identical frames", () => {
    const frames = [makeFrame("a", 7), makeFrame("b", 7), makeFrame("c", 7)];
    const { unique, aliases } = dedupeFrames(frames);
    expect(unique).toHaveLength(1);
    expect(unique[0].name).toBe("a");
    expect(aliases.get("b")).toBe("a");
    expect(aliases.get("c")).toBe("a");
  });

  it("returns empty results for empty input", () => {
    const { unique, aliases } = dedupeFrames([]);
    expect(unique).toHaveLength(0);
    expect(aliases.size).toBe(0);
  });
});

describe("resolveAlias", () => {
  it("returns the name itself when no alias exists", () => {
    const aliases = new Map<string, string>();
    expect(resolveAlias("walk_01", aliases)).toBe("walk_01");
  });

  it("resolves a single alias", () => {
    const aliases = new Map([["idle_01", "walk_01"]]);
    expect(resolveAlias("idle_01", aliases)).toBe("walk_01");
  });

  it("resolves a chained alias", () => {
    const aliases = new Map([
      ["c", "b"],
      ["b", "a"],
    ]);
    expect(resolveAlias("c", aliases)).toBe("a");
  });

  it("throws on circular alias", () => {
    const aliases = new Map([
      ["a", "b"],
      ["b", "a"],
    ]);
    expect(() => resolveAlias("a", aliases)).toThrow("Circular alias");
  });
});
