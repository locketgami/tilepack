/**
 * reorder.ts — sort/reorder packed frames by various strategies
 */

export type ReorderMode = "none" | "name" | "area" | "width" | "height";

export interface ReorderOptions {
  mode: ReorderMode;
  descending?: boolean;
}

export interface OrderableFrame {
  name: string;
  w: number;
  h: number;
}

export function isValidReorderMode(mode: string): mode is ReorderMode {
  return ["none", "name", "area", "width", "height"].includes(mode);
}

export function reorderFrames<T extends OrderableFrame>(
  frames: T[],
  options: ReorderOptions
): T[] {
  if (options.mode === "none") return [...frames];

  const sorted = [...frames].sort((a, b) => {
    let cmp = 0;
    switch (options.mode) {
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "area":
        cmp = a.w * a.h - b.w * b.h;
        break;
      case "width":
        cmp = a.w - b.w;
        break;
      case "height":
        cmp = a.h - b.h;
        break;
    }
    return options.descending ? -cmp : cmp;
  });

  return sorted;
}

export function reorderLabel(options: ReorderOptions): string {
  if (options.mode === "none") return "reorder:none";
  const dir = options.descending ? "desc" : "asc";
  return `reorder:${options.mode}:${dir}`;
}
