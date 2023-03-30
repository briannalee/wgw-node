/**
 * @returns A decimal color value from RBG values
 */
export function RGBToDecimal(r: number, g: number, b: number): number {
    return r * (256*256) + g * 256 + b;
}

/**
 * @returns A RBG array from a decimal color value
 */
export function DecimalToRGB(c: number): number[] {
    return [
        Math.floor(c / (256*256)), // red
        Math.floor(c / 256) % 256, // green
        c % 256 //blue
    ];
}

export enum ColorIndices {
    Error,
    Cliff,
    SteepCliff,
    DeepSea,
    ShallowSea,
    Coastal,
    Lowlands,
    Hills,
    Highlands,
    Peaks,
}

export const Colors: number[] = new Array(Object.keys(ColorIndices).length);
Colors[ColorIndices.Error] = RGBToDecimal(255, 0, 255);
Colors[ColorIndices.Cliff] = RGBToDecimal(104, 103, 93);
Colors[ColorIndices.SteepCliff] = RGBToDecimal(94, 93, 83);
Colors[ColorIndices.DeepSea] = RGBToDecimal(29, 162, 216);
Colors[ColorIndices.ShallowSea] = RGBToDecimal(127, 205, 255);
Colors[ColorIndices.Coastal] = RGBToDecimal(255, 255, 204);
Colors[ColorIndices.Lowlands] = RGBToDecimal(90, 67, 49);
Colors[ColorIndices.Hills] = RGBToDecimal(99, 73, 55);
Colors[ColorIndices.Highlands] = RGBToDecimal(107, 88, 73);
Colors[ColorIndices.Peaks] = RGBToDecimal(114, 113, 103);

