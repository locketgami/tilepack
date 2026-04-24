export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PackedFrame extends Rect {
  id: string;
  rotated: boolean;
}

export interface PackResult {
  frames: PackedFrame[];
  atlasWidth: number;
  atlasHeight: number;
  efficiency: number;
}

function nextPowerOfTwo(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

export function packFrames(
  frames: Array<{ id: string; width: number; height: number }>,
  maxSize: number = 4096,
  padding: number = 1
): PackResult {
  const sorted = [...frames].sort(
    (a, b) => b.width * b.height - a.width * a.height
  );

  const packed: PackedFrame[] = [];
  const spaces: Rect[] = [{ x: 0, y: 0, width: maxSize, height: maxSize }];

  for (const frame of sorted) {
    const pw = frame.width + padding * 2;
    const ph = frame.height + padding * 2;

    let placed = false;
    for (let i = 0; i < spaces.length; i++) {
      const space = spaces[i];
      if (pw <= space.width && ph <= space.height) {
        packed.push({
          id: frame.id,
          x: space.x + padding,
          y: space.y + padding,
          width: frame.width,
          height: frame.height,
          rotated: false,
        });
        spaces.splice(i, 1);
        spaces.push({ x: space.x + pw, y: space.y, width: space.width - pw, height: ph });
        spaces.push({ x: space.x, y: space.y + ph, width: space.width, height: space.height - ph });
        placed = true;
        break;
      }
    }

    if (!placed) {
      throw new Error(`Frame "${frame.id}" (${frame.width}x${frame.height}) could not be packed into atlas`);
    }
  }

  const usedW = Math.max(...packed.map((f) => f.x + f.width + padding));
  const usedH = Math.max(...packed.map((f) => f.y + f.height + padding));
  const atlasWidth = nextPowerOfTwo(usedW);
  const atlasHeight = nextPowerOfTwo(usedH);

  const usedArea = packed.reduce((sum, f) => sum + f.width * f.height, 0);
  const efficiency = usedArea / (atlasWidth * atlasHeight);

  return { frames: packed, atlasWidth, atlasHeight, efficiency };
}
