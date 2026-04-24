import { hashBuffer } from "./hash";

export interface Frame {
  name: string;
  data: Buffer;
  width: number;
  height: number;
}

export interface DedupeResult {
  unique: Frame[];
  aliases: Map<string, string>;
}

/**
 * Deduplicates frames by content hash.
 * Returns unique frames and a map of duplicate name -> canonical name.
 */
export function dedupeFrames(frames: Frame[]): DedupeResult {
  const hashToName = new Map<string, string>();
  const aliases = new Map<string, string>();
  const unique: Frame[] = [];

  for (const frame of frames) {
    const hash = hashBuffer(frame.data);

    if (hashToName.has(hash)) {
      const canonical = hashToName.get(hash)!;
      aliases.set(frame.name, canonical);
    } else {
      hashToName.set(hash, frame.name);
      unique.push(frame);
    }
  }

  return { unique, aliases };
}

/**
 * Resolves the canonical name for a frame, following alias chain if needed.
 */
export function resolveAlias(name: string, aliases: Map<string, string>): string {
  const seen = new Set<string>();
  let current = name;

  while (aliases.has(current)) {
    if (seen.has(current)) {
      throw new Error(`Circular alias detected for frame: ${name}`);
    }
    seen.add(current);
    current = aliases.get(current)!;
  }

  return current;
}

/**
 * Returns the number of bytes saved by deduplication.
 * Useful for logging or reporting compression efficiency.
 */
export function dedupeBytesSaved(frames: Frame[], result: DedupeResult): number {
  const aliasedNames = new Set(result.aliases.keys());
  return frames
    .filter((f) => aliasedNames.has(f.name))
    .reduce((sum, f) => sum + f.data.byteLength, 0);
}
