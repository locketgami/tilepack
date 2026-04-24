# tilepack

> CLI tool for packing and optimizing sprite tilesets for 2D game engines

[![npm version](https://img.shields.io/npm/v/tilepack)](https://www.npmjs.com/package/tilepack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Installation

```bash
npm install -g tilepack
```

---

## Usage

Pack a directory of sprites into an optimized tileset atlas:

```bash
tilepack pack ./sprites --output ./dist/atlas
```

This generates `atlas.png` and `atlas.json` in the output directory.

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--output`, `-o` | Output directory | `./out` |
| `--size` | Max atlas size (px) | `2048` |
| `--padding` | Padding between sprites | `2` |
| `--format` | Output format (`json`, `xml`) | `json` |

### Example

```bash
# Pack sprites with custom atlas size and padding
tilepack pack ./assets/sprites -o ./dist -size 1024 --padding 4 --format json
```

---

## Development

```bash
git clone https://github.com/yourname/tilepack.git
cd tilepack
npm install
npm run build
```

---

## License

[MIT](./LICENSE) © 2024 yourname