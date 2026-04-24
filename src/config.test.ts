import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { loadConfig, defaultConfig, TilepackConfigSchema } from './config';

describe('TilepackConfig', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tilepack-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should return defaults for minimal config', () => {
    const config = defaultConfig();
    expect(config.tileSize).toBe(16);
    expect(config.padding).toBe(1);
    expect(config.format).toBe('png');
    expect(config.deduplicate).toBe(true);
    expect(config.powerOfTwo).toBe(true);
  });

  it('should load a valid config file', () => {
    const configData = { input: './assets', output: './out', tileSize: 32, format: 'webp' };
    const configPath = path.join(tmpDir, 'tilepack.config.json');
    fs.writeFileSync(configPath, JSON.stringify(configData));

    const config = loadConfig(configPath);
    expect(config.input).toBe('./assets');
    expect(config.tileSize).toBe(32);
    expect(config.format).toBe('webp');
    expect(config.name).toBe('tileset'); // default
  });

  it('should throw if config file does not exist', () => {
    expect(() => loadConfig('/nonexistent/path/config.json')).toThrow('Config file not found');
  });

  it('should throw on invalid config values', () => {
    const bad = { input: './sprites', output: './out', tileSize: -5 };
    const configPath = path.join(tmpDir, 'tilepack.config.json');
    fs.writeFileSync(configPath, JSON.stringify(bad));
    expect(() => loadConfig(configPath)).toThrow('Invalid config');
  });

  it('should reject unknown format values', () => {
    const result = TilepackConfigSchema.safeParse({ input: '.', output: '.', format: 'bmp' });
    expect(result.success).toBe(false);
  });
});
