import * as fs from "fs";
import * as path from "path";
import { AtlasManifest } from "./atlas";

export interface OutputOptions {
  outDir: string;
  baseName: string;
  format: "json" | "json-array" | "jsonhash";
}

export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeManifest(
  manifest: AtlasManifest,
  json: string,
  options: OutputOptions
): { manifestPath: string } {
  ensureDir(options.outDir);

  const manifestPath = path.join(options.outDir, `${options.baseName}.json`);
  fs.writeFileSync(manifestPath, json, "utf-8");

  return { manifestPath };
}

export function writePng(
  buffer: Buffer,
  options: OutputOptions
): { imagePath: string } {
  ensureDir(options.outDir);

  const imagePath = path.join(options.outDir, `${options.baseName}.png`);
  fs.writeFileSync(imagePath, buffer);

  return { imagePath };
}

export function resolveOutputOptions(
  partial: Partial<OutputOptions> & { outDir: string; baseName: string }
): OutputOptions {
  return {
    format: "json",
    ...partial,
  };
}
