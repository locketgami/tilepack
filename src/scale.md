# Scale Module

The `scale` module handles resizing sprite frames before they are packed into an atlas.
This is useful for generating multiple resolution variants (e.g. `@1x`, `@2x`) from a
single source tileset.

## API

### `scaleFrame(image, options)`

Scales a single `Jimp` image by the given factor.

- `factor` — multiplier applied to both width and height (e.g. `2` doubles size)
- `mode` — interpolation algorithm: `"nearest"` (default), `"bilinear"`, or `"bicubic"`

Returns a **new** Jimp instance; the original is not mutated.

### `scaleFrames(images, options)`

Convenience wrapper that applies `scaleFrame` to an array of images.

### `scaledDimensions(width, height, factor)`

Pure utility that returns the resulting `{ width, height }` after scaling,
without creating any image objects.

### `validateScaleFactor(factor)`

Throws if `factor` is `<= 0` or `> 8`.

## Usage in pipeline

```ts
import { scaleFrames } from "./scale";

const scaled = scaleFrames(rawFrames, { factor: config.scale ?? 1 });
```

## Notes

- A factor of `1` is a no-op; the frame is still cloned so downstream mutations are safe.
- Fractional dimensions are rounded with `Math.round`.
