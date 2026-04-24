import * as crypto from "crypto";
import * as fs from "fs";

/**
 * Compute a short content hash for a file (first 8 hex chars of SHA-256).
 * Used to detect whether source images have changed between runs.
 */
export function hashFile(filePath: string): string {
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex").slice(0, 8);
}

/**
 * Compute a hash directly from a Buffer (e.g. an in-memory frame).
 */
export function hashBuffer(buf: Buffer): string {
  return crypto.createHash("sha256").update(buf).digest("hex").slice(0, 8);
}

export interface CacheEntry {
  hash: string;
  packedX: number;
  packedY: number;
  w: number;
  h: number;
}

export type HashCache = Record<string, CacheEntry>;

/**
 * Load a previously saved hash cache from disk.
 * Returns an empty cache if the file does not exist or is malformed.
 */
export function loadCache(cachePath: string): HashCache {
  try {
    const raw = fs.readFileSync(cachePath, "utf-8");
    return JSON.parse(raw) as HashCache;
  } catch {
    return {};
  }
}

/**
 * Persist the hash cache to disk as JSON.
 */
export function saveCache(cachePath: string, cache: HashCache): void {
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");
}

/**
 * Check whether a frame is still valid in the cache.
 */
export function isCacheHit(cache: HashCache, key: string, currentHash: string): boolean {
  const entry = cache[key];
  return entry !== undefined && entry.hash === currentHash;
}
