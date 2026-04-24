export interface FrameRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FrameEntry {
  frame: FrameRect;
  rotated: boolean;
  trimmed: boolean;
  sourceSize: { w: number; h: number };
}

export interface AtlasManifest {
  meta: {
    image: string;
    size: { w: number; h: number };
    scale: number;
  };
  frames: Record<string, FrameEntry>;
}

export function buildManifest(
  image: string,
  atlasSize: { w: number; h: number },
  entries: Array<{ name: string } & FrameEntry>
): AtlasManifest {
  const frames: Record<string, FrameEntry> = {};
  for (const { name, ...entry } of entries) {
    frames[name] = entry;
  }
  return {
    meta: { image, size: atlasSize, scale: 1 },
    frames,
  };
}

export function manifestToJson(manifest: AtlasManifest, pretty = true): string {
  return pretty
    ? JSON.stringify(manifest, null, 2)
    : JSON.stringify(manifest);
}

export function lookupFrame(
  manifest: AtlasManifest,
  name: string
): FrameEntry | undefined {
  return manifest.frames[name];
}
