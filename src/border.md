# Border

The border module adds a configurable pixel border around each sprite frame before packing.
This is useful for preventing texture bleeding in GPU rendering.

## Modes

| Mode          | Description                                              |
|---------------|----------------------------------------------------------|
| `clamp`       | Repeats the outermost edge pixel into the border region  |
| `solid`       | Same as clamp — fills border by extending edge pixels    |
| `transparent` | Fills the border with fully transparent (alpha=0) pixels |

## Configuration

In `tilepack.config.json`:

```json
{
  "border": {
    "size": 2,
    "mode": "clamp"
  }
}
```

- `size` — border thickness in pixels (0–64, default: `1`)
- `mode` — fill strategy (default: `"clamp"`)

Set `border` to `false` or omit it entirely to disable.

## Notes

- Border is applied **after** trimming and **before** packing.
- The atlas manifest records the **original** frame dimensions, not the bordered ones.
- A border size of `0` is a no-op and skips processing entirely.
