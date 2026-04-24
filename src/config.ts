import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

export const TilepackConfigSchema = z.object({
  input: z.string().describe('Glob pattern or directory for input sprites'),
  output: z.string().describe('Output directory for packed tileset'),
  name: z.string().default('tileset').describe('Base name for output files'),
  tileSize: z.number().int().positive().default(16).describe('Tile size in pixels'),
  padding: z.number().int().min(0).default(1).describe('Padding between tiles in pixels'),
  maxWidth: z.number().int().positive().default(2048).describe('Max atlas width in pixels'),
  maxHeight: z.number().int().positive().default(2048).describe('Max atlas height in pixels'),
  format: z.enum(['png', 'webp']).default('png').describe('Output image format'),
  metaFormat: z.enum(['json', 'xml']).default('json').describe('Output metadata format'),
  deduplicate: z.boolean().default(true).describe('Remove duplicate tiles'),
  powerOfTwo: z.boolean().default(true).describe('Force atlas dimensions to power of two'),
});

export type TilepackConfig = z.infer<typeof TilepackConfigSchema>;

export function loadConfig(configPath?: string): TilepackConfig {
  const resolvedPath = configPath
    ? path.resolve(configPath)
    : path.resolve(process.cwd(), 'tilepack.config.json');

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Config file not found: ${resolvedPath}`);
  }

  const raw = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
  const result = TilepackConfigSchema.safeParse(raw);

  if (!result.success) {
    const issues = result.error.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid config:\n${issues}`);
  }

  return result.data;
}

export function defaultConfig(): TilepackConfig {
  return TilepackConfigSchema.parse({
    input: './sprites',
    output: './dist',
  });
}
