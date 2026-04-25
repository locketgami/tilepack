# rotate

The `rotate` module applies clockwise rotation to sprite frames before packing.

## Supported Angles

Only multiples of 90 degrees are supported: **90**, **180**, **270**.

## Usage

```ts
import { rotateFrames, parseRotateAngle } from "./rotate";

const angle = parseRotateAngle(config.rotate); // 90 | 180 | 270
const rotated = await rotateFrames(frames, { angle });
```

## API

### `isValidAngle(value: number): value is RotationAngle`

Returns `true` if the number is a valid rotation angle (90, 180, or 270).

### `parseRotateAngle(raw: unknown): RotationAngle`

Parses and validates a rotation angle from config input. Throws if the value is not valid.

### `rotatedDimensions(width, height, angle)`

Returns the expected output dimensions after rotation. For 90/270, width and height are swapped. For 180, dimensions are unchanged.

### `rotateFrame(frame, options): Promise<Jimp>`

Rotates a single Jimp frame. Returns a new frame; the original is not mutated.

### `rotateFrames(frames, options): Promise<Jimp[]>`

Convenience wrapper that rotates an array of frames in parallel.

## Notes

- Rotation is applied **before** trimming and packing in the pipeline.
- The `expand` option defaults to `true`, ensuring the canvas resizes to fit the rotated content.
