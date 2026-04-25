import Jimp from "jimp";
import { autoCropFrame, cropBytesSaved, cropImage } from "./crop";

async function makeTransparentFrame(w: number, h: number): Promise<Jimp> {
  const img = new Jimp(w, h, 0x00000000);
  return img;
}

async function makeSolidFrame(w: number, h: number): Promise<Jimp> {
  const img = new Jimp(w, h, 0xff0000ff);
  return img;
}

describe("cropImage", () => {
  it("crops to the given rect", async () => {
    const img = await makeSolidFrame(32, 32);
    const cropped = cropImage(img, { x: 4, y: 4, width: 16, height: 16 });
    expect(cropped.getWidth()).toBe(16);
    expect(cropped.getHeight()).toBe(16);
  });
});

describe("autoCropFrame", () => {
  it("returns full rect for fully opaque image", async () => {
    const img = await makeSolidFrame(16, 16);
    const result = autoCropFrame(img);
    expect(result.rect.x).toBe(0);
    expect(result.rect.y).toBe(0);
    expect(result.rect.width).toBe(16);
    expect(result.rect.height).toBe(16);
    expect(result.wasCropped).toBe(false);
  });

  it("returns full rect with wasCropped=false for fully transparent image", async () => {
    const img = await makeTransparentFrame(16, 16);
    const result = autoCropFrame(img);
    expect(result.wasCropped).toBe(false);
    expect(result.rect.width).toBe(16);
  });

  it("crops transparent border correctly", async () => {
    const img = new Jimp(16, 16, 0x00000000);
    // place a 4x4 solid block at (6,6)
    for (let y = 6; y < 10; y++) {
      for (let x = 6; x < 10; x++) {
        img.setPixelColor(0xff0000ff, x, y);
      }
    }
    const result = autoCropFrame(img);
    expect(result.wasCropped).toBe(true);
    expect(result.rect.x).toBe(6);
    expect(result.rect.y).toBe(6);
    expect(result.rect.width).toBe(4);
    expect(result.rect.height).toBe(4);
    expect(result.image.getWidth()).toBe(4);
    expect(result.image.getHeight()).toBe(4);
  });
});

describe("cropBytesSaved", () => {
  it("calculates bytes saved correctly", () => {
    const original = { x: 0, y: 0, width: 16, height: 16 };
    const cropped = { x: 4, y: 4, width: 8, height: 8 };
    const saved = cropBytesSaved(original, cropped);
    expect(saved).toBe((16 * 16 - 8 * 8) * 4);
  });

  it("returns 0 when no saving", () => {
    const rect = { x: 0, y: 0, width: 8, height: 8 };
    expect(cropBytesSaved(rect, rect)).toBe(0);
  });
});
