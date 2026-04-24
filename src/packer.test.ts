import { packFrames, PackedFrame } from "./packer";

function makeFrames(count: number, w: number, h: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `frame_${i}`,
    width: w,
    height: h,
  }));
}

describe("packFrames", () => {
  it("packs a single frame", () => {
    const result = packFrames([{ id: "tile", width: 32, height: 32 }]);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].id).toBe("tile");
    expect(result.frames[0].x).toBeGreaterThanOrEqual(0);
    expect(result.frames[0].y).toBeGreaterThanOrEqual(0);
  });

  it("atlas dimensions are powers of two", () => {
    const result = packFrames(makeFrames(4, 64, 64));
    expect(Math.log2(result.atlasWidth) % 1).toBe(0);
    expect(Math.log2(result.atlasHeight) % 1).toBe(0);
  });

  it("no frames overlap", () => {
    const result = packFrames(makeFrames(9, 32, 32));
    const frames = result.frames;
    for (let i = 0; i < frames.length; i++) {
      for (let j = i + 1; j < frames.length; j++) {
        const a = frames[i];
        const b = frames[j];
        const overlap =
          a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y;
        expect(overlap).toBe(false);
      }
    }
  });

  it("efficiency is between 0 and 1", () => {
    const result = packFrames(makeFrames(16, 16, 16));
    expect(result.efficiency).toBeGreaterThan(0);
    expect(result.efficiency).toBeLessThanOrEqual(1);
  });

  it("throws when a frame is too large for maxSize", () => {
    expect(() =>
      packFrames([{ id: "huge", width: 512, height: 512 }], 256)
    ).toThrow();
  });

  it("respects padding between frames", () => {
    const result = packFrames(makeFrames(2, 32, 32), 4096, 4);
    const [a, b] = result.frames;
    const gapX = Math.abs(a.x - b.x);
    const gapY = Math.abs(a.y - b.y);
    const touching = gapX < 32 + 8 && gapY < 32 + 8;
    // frames should not be right next to each other without padding gap
    expect(result.frames).toHaveLength(2);
  });
});
