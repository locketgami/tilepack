import path from "path";
import Jimp from "jimp";
import { TilepackConfig } from "./config";
import { validateImageSize, getFrameCount } from "./image";
import { packFrames } from "./packer";
import { buildManifest, manifestToJson } from "./atlas";
import { ensureDir, writeManifest, writePng, resolveOutputOptions } from "./output";
import { trimImage, TrimResult } from "./trim";

export interface PipelineResult {
  frameCount: number;
  atlasWidth: number;
  atlasHeight: number;
  trimmedCount: number;
  outputDir: string;
}

export async function runPipeline(config: TilepackConfig): Promise<PipelineResult> {
  const inputPath = path.resolve(config.input);
  const source = await Jimp.read(inputPath);

  validateImageSize(source.bitmap.width, source.bitmap.height, config.frameWidth, config.frameHeight);

  const frameCount = getFrameCount(source.bitmap.width, source.bitmap.height, config.frameWidth, config.frameHeight);

  // Slice frames and optionally trim each one
  const frames: Array<{ image: Jimp; trim: TrimResult; index: number }> = [];
  let trimmedCount = 0;

  for (let i = 0; i < frameCount; i++) {
    const cols = Math.floor(source.bitmap.width / config.frameWidth);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const fx = col * config.frameWidth;
    const fy = row * config.frameHeight;

    const raw = source.clone().crop(fx, fy, config.frameWidth, config.frameHeight);

    const { image, trim } = config.trim
      ? await trimImage(raw)
      : { image: raw, trim: { rect: { x: 0, y: 0, width: config.frameWidth, height: config.frameHeight }, wasTrimmed: false } };

    if (trim.wasTrimmed) trimmedCount++;
    frames.push({ image, trim, index: i });
  }

  const packedFrames = packFrames(
    frames.map((f) => ({ id: f.index, width: f.image.bitmap.width, height: f.image.bitmap.height })),
    config.padding ?? 1
  );

  const manifest = buildManifest(packedFrames, frames.map((f) => f.trim));
  const outputOptions = resolveOutputOptions(config);

  await ensureDir(outputOptions.dir);
  await writeManifest(path.join(outputOptions.dir, outputOptions.manifestName), manifestToJson(manifest));
  await writePng(path.join(outputOptions.dir, outputOptions.atlasName), packedFrames, frames.map((f) => f.image));

  return {
    frameCount,
    atlasWidth: packedFrames.width,
    atlasHeight: packedFrames.height,
    trimmedCount,
    outputDir: outputOptions.dir,
  };
}
