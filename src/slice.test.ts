import Jimp from "jimp";
import { sliceSheet, frameCountFromDimensions, SlicedFrame } from "./slice";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

async function makeTempSheet(
  cols: number,
  rows: number,
  frameW: number,
  frameH: number
): Promise<string> {
  const img = new Jimp(cols * frameW, rows * frameH, 0x00000000);
  // paint each cell a distinct gray so crops are distinguishable
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const shade = ((r * cols + c) * 30) & 0xff;
      const color = Jimp.rgbaToInt(shade, shade, shade, 255);
      for (let py = 0; py < frameH; py++) {
        for (let px = 0; px < frameW; px++) {
          img.setPixelColor(color, c * frameW + px, r * frameH + py);
        }
      }
    }
  }
  const tmpPath = path.join(os.tmpdir(), `sheet_${Date.now()}.png`);
  await img.writeAsync(tmpPath);
  return tmpPath;
}

describe("frameCountFromDimensions", () => {
  it("returns correct count for even division", () => {
    expect(frameCountFromDimensions(128, 64, 32, 32)).toBe(8);
  });

  it("floors when sheet is not perfectly divisible", () => {
    expect(frameCountFromDimensions(100, 100, 32, 32)).toBe(9);
  });

  it("returns 0 for zero frame size", () => {
    expect(frameCountFromDimensions(128, 128, 0, 32)).toBe(0);
  });
});

describe("sliceSheet", () => {
  it("produces correct number of frames", async () => {
    const tmpPath = await makeTempSheet(4, 2, 16, 16);
    const frames = await sliceSheet(tmpPath, 16, 16);
    expect(frames).toHaveLength(8);
    fs.unlinkSync(tmpPath);
  });

  it("assigns sequential indices", async () => {
    const tmpPath = await makeTempSheet(3, 1, 8, 8);
    const frames = await sliceSheet(tmpPath, 8, 8);
    expect(frames.map((f) => f.index)).toEqual([0, 1, 2]);
    fs.unlinkSync(tmpPath);
  });

  it("throws when sheet is not evenly divisible", async () => {
    const tmpPath = await makeTempSheet(3, 1, 8, 8); // 24x8
    await expect(sliceSheet(tmpPath, 7, 8)).rejects.toThrow(
      /not evenly divisible/
    );
    fs.unlinkSync(tmpPath);
  });

  it("throws for invalid frame size", async () => {
    const tmpPath = await makeTempSheet(2, 2, 16, 16);
    await expect(sliceSheet(tmpPath, 0, 16)).rejects.toThrow(/Invalid frame/);
    fs.unlinkSync(tmpPath);
  });

  it("cropped frame has correct dimensions", async () => {
    const tmpPath = await makeTempSheet(2, 2, 24, 32);
    const frames = await sliceSheet(tmpPath, 24, 32);
    for (const frame of frames) {
      expect(frame.image.getWidth()).toBe(24);
      expect(frame.image.getHeight()).toBe(32);
    }
    fs.unlinkSync(tmpPath);
  });
});
