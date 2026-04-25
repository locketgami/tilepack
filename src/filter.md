# Filter

The `filter` module controls the resampling kernel used when frames are scaled
during atlas generation.

## Modes

| Mode      | Sharp kernel | Best for                          |
|-----------|-------------|-----------------------------------|
| `nearest` | `nearest`   | pixel-art; no interpolation       |
| `linear`  | `linear`    | general-purpose smooth scaling    |
| `cubic`   | `cubic`     | photo-like content, softer result |
| `lanczos` | `lanczos3`  | high-quality downscaling          |

## Configuration

Add a `filter` key to your `tilepack.config.json`:

```json
{
  "filter": "lanczos",
  "sharpness": 2
}
```

`sharpness` is only meaningful for `lanczos` and is clamped to the range **0–3**.

## Defaults

When no filter is specified the pipeline uses `linear`, which gives a good
balance between quality and performance for most sprite content.

## Notes

- For pixel-art tilesets always use `nearest` to avoid colour blending between
  adjacent pixels.
- The filter is applied at the `scale` stage; if no scaling occurs the option
  has no visible effect.
