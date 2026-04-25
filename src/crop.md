# crop

The `crop` module handles automatic trimming of transparent borders from sprite frames before packing.

## Overview

When sprites are exported from tools like Aseprite or Photoshop, they often include extra transparent pixels around the actual content. Cropping these borders reduces atlas size and improves packing efficiency.

## Functions

### `autoCropFrame(image: Jimp): CropResult`

Scans the image pixel-by-pixel and finds the tightest bounding box around all non-transparent pixels.

Returns a `CropResult` containing:
- `image` — the cropped Jimp image
- `rect` — the `CropRect` that was applied (relative to the original)
- `wasCropped` — whether any cropping actually occurred

### `cropImage(image: Jimp, rect: CropRect): Jimp`

Crops a Jimp image to an explicit rectangle. Does not mutate the original.

### `cropBytesSaved(original: CropRect, cropped: CropRect): number`

Calculates how many bytes (RGBA) were saved by the crop operation.

## Configuration

Crop behavior is controlled via `CropConfig` (see `crop.config.ts`):

```json
{
  "crop": {
    "enabled": true,
    "minSavingThreshold": 64,
    "padding": 1
  }
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Toggle auto-crop globally |
| `minSavingThreshold` | number | `0` | Minimum pixel area saved to apply crop |
| `padding` | number | `0` | Extra transparent padding to preserve around content |

## Notes

- The `rect` stored in the atlas manifest is used by the game engine to reconstruct the original sprite position at runtime.
- Fully transparent frames are not cropped (returned as-is).
