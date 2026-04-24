import { validateImageSize, getFrameCount, ImageFrame } from './image';
import Jimp from 'jimp';

function makeFakeFrame(width: number, height: number): ImageFrame {
  return {
    name: 'test',
    filePath: '/fake/test.png',
    width,
    height,
    data: new Jimp(width, height),
  };
}

describe('validateImageSize', () => {
  it('returns true when dimensions are exact multiples of tile size', () => {
    const frame = makeFakeFrame(64, 64);
    expect(validateImageSize(frame, 16, 16)).toBe(true);
  });

  it('returns false when width is not a multiple of tile width', () => {
    const frame = makeFakeFrame(70, 64);
    expect(validateImageSize(frame, 16, 16)).toBe(false);
  });

  it('returns false when height is not a multiple of tile height', () => {
    const frame = makeFakeFrame(64, 70);
    expect(validateImageSize(frame, 16, 16)).toBe(false);
  });

  it('handles non-square tiles', () => {
    const frame = makeFakeFrame(96, 48);
    expect(validateImageSize(frame, 32, 16)).toBe(true);
  });
});

describe('getFrameCount', () => {
  it('returns correct frame count for a single tile image', () => {
    const frame = makeFakeFrame(16, 16);
    expect(getFrameCount(frame, 16, 16)).toBe(1);
  });

  it('returns correct frame count for a 4x4 grid', () => {
    const frame = makeFakeFrame(64, 64);
    expect(getFrameCount(frame, 16, 16)).toBe(16);
  });

  it('ignores partial tiles at the edge', () => {
    const frame = makeFakeFrame(70, 70);
    expect(getFrameCount(frame, 16, 16)).toBe(16);
  });

  it('works with non-square tile sizes', () => {
    const frame = makeFakeFrame(96, 32);
    expect(getFrameCount(frame, 32, 16)).toBe(6);
  });
});
