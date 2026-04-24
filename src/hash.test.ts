import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {
  hashFile,
  hashBuffer,
  loadCache,
  saveCache,
  isCacheHit,
  HashCache,
} from "./hash";

function makeTempFile(content: Buffer | string): string {
  const tmp = path.join(os.tmpdir(), `tilepack-hash-test-${Date.now()}`);
  fs.writeFileSync(tmp, content);
  return tmp;
}

describe("hashFile", () => {
  it("returns an 8-character hex string", () => {
    const f = makeTempFile("hello tilepack");
    const h = hashFile(f);
    expect(h).toHaveLength(8);
    expect(h).toMatch(/^[0-9a-f]+$/);
    fs.unlinkSync(f);
  });

  it("produces the same hash for identical content", () => {
    const f1 = makeTempFile("same content");
    const f2 = makeTempFile("same content");
    expect(hashFile(f1)).toBe(hashFile(f2));
    fs.unlinkSync(f1);
    fs.unlinkSync(f2);
  });

  it("produces different hashes for different content", () => {
    const f1 = makeTempFile("aaa");
    const f2 = makeTempFile("bbb");
    expect(hashFile(f1)).not.toBe(hashFile(f2));
    fs.unlinkSync(f1);
    fs.unlinkSync(f2);
  });
});

describe("hashBuffer", () => {
  it("returns an 8-char hex string from a buffer", () => {
    const h = hashBuffer(Buffer.from("sprite data"));
    expect(h).toHaveLength(8);
    expect(h).toMatch(/^[0-9a-f]+$/);
  });
});

describe("cache helpers", () => {
  const cachePath = path.join(os.tmpdir(), `tilepack-cache-${Date.now()}.json`);

  afterAll(() => {
    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
  });

  it("loadCache returns empty object for missing file", () => {
    expect(loadCache("/nonexistent/path/cache.json")).toEqual({});
  });

  it("round-trips save and load", () => {
    const cache: HashCache = {
      "sprite/run_0": { hash: "abcd1234", packedX: 0, packedY: 0, w: 32, h: 32 },
    };
    saveCache(cachePath, cache);
    const loaded = loadCache(cachePath);
    expect(loaded).toEqual(cache);
  });

  it("isCacheHit returns true on matching hash", () => {
    const cache: HashCache = {
      "sprite/idle_0": { hash: "deadbeef", packedX: 64, packedY: 0, w: 16, h: 16 },
    };
    expect(isCacheHit(cache, "sprite/idle_0", "deadbeef")).toBe(true);
  });

  it("isCacheHit returns false on hash mismatch", () => {
    const cache: HashCache = {
      "sprite/idle_0": { hash: "deadbeef", packedX: 64, packedY: 0, w: 16, h: 16 },
    };
    expect(isCacheHit(cache, "sprite/idle_0", "cafebabe")).toBe(false);
  });

  it("isCacheHit returns false for unknown key", () => {
    expect(isCacheHit({}, "missing/key", "anything")).toBe(false);
  });
});
