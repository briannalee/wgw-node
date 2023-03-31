import {Color, Colors} from "./colors";

interface HeightColorMap {
  heightRange: [number, number];
  color: Color;
  label: string;
}

export const heightColorMap: HeightColorMap[] = [
  {
    heightRange: [-Infinity, 0.03],
    color: Color.DeepSea,
    label: "deep water",
  },
  {
    heightRange: [0.03, 0.1],
    color: Color.ShallowSea,
    label: "water",
  },
  {
    heightRange: [0.1, 0.12],
    color: Color.Coastal,
    label: "coastal",
  },
  {
    heightRange: [0.12, 0.3],
    color: Color.Lowlands,
    label: "lowlands",
  },
  {
    heightRange: [0.3, 0.52],
    color: Color.Hills,
    label: "hills",
  },
  {
    heightRange: [0.52, 0.61],
    color: Color.Highlands,
    label: "highlands",
  },
  {
    heightRange: [0.61, Infinity],
    color: Color.Peaks,
    label: "mountains",
  },
];
