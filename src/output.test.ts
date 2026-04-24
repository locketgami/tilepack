import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  ensureDir,
  writeManifest,
  writePng,
  resolveOutputOptions,
} from "./output";
import { AtlasManifest } from "./atlas";

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "tilepack-test-"));
}

const fakeManifest: AtlasManifest = {
  meta: { image: "sheet.png", size: { w: 64, h: 64 }, scale: 1 },
  frames: {},
};

describe("ensureDir", () => {
  it("creates directory if it does not exist", () => {
    const tmp = makeTempDir();
    const target = path.join(tmp, "nested", "dir");
    ensureDir(target);
    expect(fs.existsSync(target)).toBe(true);
    fs.rmSync(tmp, { recursive: true });
  });

  it("does not throw if directory already exists", () => {
    const tmp = makeTempDir();
    expect(() => ensureDir(tmp)).not.toThrow();
    fs.rmSync(tmp, { recursive: true });
  });
});

describe("writeManifest", () => {
  it("writes json file to outDir", () => {
    const tmp = makeTempDir();
    const opts = resolveOutputOptions({ outDir: tmp, baseName: "atlas" });
    const json = JSON.stringify(fakeManifest, null, 2);
    const { manifestPath } = writeManifest(fakeManifest, json, opts);
    expect(fs.existsSync(manifestPath)).toBe(true);
    expect(JSON.parse(fs.readFileSync(manifestPath, "utf-8"))).toEqual(fakeManifest);
    fs.rmSync(tmp, { recursive: true });
  });
});

describe("writePng", () => {
  it("writes buffer to png file", () => {
    const tmp = makeTempDir();
    const opts = resolveOutputOptions({ outDir: tmp, baseName: "atlas" });
    const buf = Buffer.from([137, 80, 78, 71]);
    const { imagePath } = writePng(buf, opts);
    expect(fs.existsSync(imagePath)).toBe(true);
    expect(fs.readFileSync(imagePath)).toEqual(buf);
    fs.rmSync(tmp, { recursive: true });
  });
});

describe("resolveOutputOptions", () => {
  it("defaults format to json", () => {
    const opts = resolveOutputOptions({ outDir: "dist", baseName: "sheet" });
    expect(opts.format).toBe("json");
  });

  it("respects provided format", () => {
    const opts = resolveOutputOptions({ outDir: "dist", baseName: "sheet", format: "jsonhash" });
    expect(opts.format).toBe("jsonhash");
  });
});
