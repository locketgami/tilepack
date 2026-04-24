import { PackResult, PackedFrame } from "./packer";

export interface AtlasFrame {
  id: string;
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  sourceSize: { w: number; h: number };
  spriteSourceSize: { x: number; y: number; w: number; h: number };
}

export interface AtlasManifest {
  meta: {
    app: string;
    version: string;
    size: { w: number; h: number };
    scale: number;
  };
  frames: Record<string, AtlasFrame>;
}

export function buildManifest(
  packResult: PackResult,
  version: string = "1.0"
): AtlasManifest {
  const frames: Record<string, AtlasFrame> = {};

  for (const pf of packResult.frames) {
    frames[pf.id] = {
      id: pf.id,
      frame: { x: pf.x, y: pf.y, w: pf.width, h: pf.height },
      rotated: pf.rotated,
      sourceSize: { w: pf.width, h: pf.height },
      spriteSourceSize: { x: 0, y: 0, w: pf.width, h: pf.height },
    };
  }

  return {
    meta: {
      app: "tilepack",
      version,
      size: { w: packResult.atlasWidth, h: packResult.atlasHeight },
      scale: 1,
    },
    frames,
  };
}

export function manifestToJson(manifest: AtlasManifest): string {
  return JSON.stringify(manifest, null, 2);
}

export function lookupFrame(
  manifest: AtlasManifest,
  id: string
): AtlasFrame | undefined {
  return manifest.frames[id];
}
