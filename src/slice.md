# slice module

Utilities for slicing a uniform sprite sheet into individual frames.

## API

### `sliceSheet(sourcePath, frameWidth, frameHeight): Promise<SlicedFrame[]>`

Reads the image at `sourcePath` and cuts it into a grid of `frameWidth × frameHeight` cells.
Returns an array of `SlicedFrame` objects ordered left-to-right, top-to-bottom.

Throws if:
- `frameWidth` or `frameHeight` is `<= 0`
- The sheet dimensions are not evenly divisible by the frame size

### `frameCountFromDimensions(sheetW, sheetH, frameW, frameH): number`

Calculates the expected frame count without loading pixel data.
Uses `Math.floor` so partially-covered cells are ignored.

## Types

```ts
interface FrameRect  { x: number; y: number; w: number; h: number; }
interface SlicedFrame { index: number; image: Jimp; rect: FrameRect; sourcePath: string; }
```

## Usage in pipeline

`sliceSheet` is called early in the pipeline (see `src/pipeline.ts`) before
trimming (`src/trim.ts`) and packing (`src/packer.ts`).  Each `SlicedFrame.image`
is passed directly to `getTrimRect` and then to `packFrames`.
