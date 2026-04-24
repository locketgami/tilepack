import Jimp from "jimp";
import { getTrimRect, trimImage } from "./trim";

async function makeImage(width: number, height: number, fillAlpha = 0): Promise<Jimp> {
  const img = new Jimp(width, height, 0x00000000);
  if (fillAlpha > 0) {
    img.scan(0, 0, width, height, (_x, _y, idx) => {
      img.bitmap.data[idx] = 255;
      img.bitmap.data[idx + 1] = 0;
      img.bitmap.data[idx + 2] = 0;
      img.bitmap.data[idx + 3] = fillAlpha;
    });
  }
  return img;
}

async function makeImageWithSprite(outerW: number, outerH: number, sx: number, sy: number, sw: number, sh: number): Promise<Jimp> {
  const img = await makeImage(outerW, outerH, 0);
  for (let y = sy; y < sy + sh; y++) {
    for (let x = sx; x < sx + sw; x++) {
      const idx = (y * outerW + x) * 4;
      img.bitmap.data[idx] = 200;
      img.bitmap.data[idx + 1] = 100;
      img.bitmap.data[idx + 2] = 50;
      img.bitmap.data[idx + 3] = 255;
    }
  }
  return img;
}

describe("getTrimRect", () => {
  it("returns full bounds for fully opaque image", async () => {
    const img = await makeImage(32, 32, 255);
    const rect = getTrimRect(img);
    expect(rect).toEqual({ x: 0, y: 0, width: 32, height: 32 });
  });

  it("returns full bounds for fully transparent image", async () => {
    const img = await makeImage(32, 32, 0);
    const rect = getTrimRect(img);
    expect(rect).toEqual({ x: 0, y: 0, width: 32, height: 32 });
  });

  it("detects tight bounding box around sprite content", async () => {
    const img = await makeImageWithSprite(32, 32, 4, 6, 10, 12);
    const rect = getTrimRect(img);
    expect(rect).toEqual({ x: 4, y: 6, width: 10, height: 12 });
  });
});

describe("trimImage", () => {
  it("marks image as not trimmed when fully opaque", async () => {
    const img = await makeImage(16, 16, 255);
    const { trim } = await trimImage(img);
    expect(trim.wasTrimmed).toBe(false);
  });

  it("trims and reports correct rect", async () => {
    const img = await makeImageWithSprite(64, 64, 8, 8, 16, 16);
    const { image: cropped, trim } = await trimImage(img);
    expect(trim.wasTrimmed).toBe(true);
    expect(trim.rect).toEqual({ x: 8, y: 8, width: 16, height: 16 });
    expect(cropped.bitmap.width).toBe(16);
    expect(cropped.bitmap.height).toBe(16);
  });
});
