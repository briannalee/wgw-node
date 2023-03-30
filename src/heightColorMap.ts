import {ColorIndices, Colors} from "./colors";

interface HeightColorMap {
  heightRange: [number, number];
  color: ColorIndices;
  label: string;
}

export const heightColorMap: HeightColorMap[] = [
  {
    heightRange: [-Infinity, 0.03],
    color: ColorIndices.DeepSea,
    label: "deep water",
  },
  {
    heightRange: [0.03, 0.1],
    color: ColorIndices.ShallowSea,
    label: "water",
  },
  {
    heightRange: [0.1, 0.12],
    color: ColorIndices.Coastal,
    label: "coastal",
  },
  {
    heightRange: [0.12, 0.3],
    color: ColorIndices.Lowlands,
    label: "lowlands",
  },
  {
    heightRange: [0.3, 0.52],
    color: ColorIndices.Hills,
    label: "hills",
  },
  {
    heightRange: [0.52, 0.61],
    color: ColorIndices.Highlands,
    label: "highlands",
  },
  {
    heightRange: [0.61, Infinity],
    color: ColorIndices.Peaks,
    label: "mountains",
  },
];
