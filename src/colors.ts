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

export enum Color {
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

/**
 * Colors, as decimal values, stores in an array
 * with the index being a ColorIndices enum
 */
export const Colors: number[] = new Array(Object.keys(Color).length);
Colors[Color.Error] = RGBToDecimal(255, 0, 255);
Colors[Color.Cliff] = RGBToDecimal(104, 103, 93);
Colors[Color.SteepCliff] = RGBToDecimal(94, 93, 83);
Colors[Color.DeepSea] = RGBToDecimal(29, 162, 216);
Colors[Color.ShallowSea] = RGBToDecimal(127, 205, 255);
Colors[Color.Coastal] = RGBToDecimal(255, 255, 204);
Colors[Color.Lowlands] = RGBToDecimal(90, 67, 49);
Colors[Color.Hills] = RGBToDecimal(99, 73, 55);
Colors[Color.Highlands] = RGBToDecimal(107, 88, 73);
Colors[Color.Peaks] = RGBToDecimal(114, 113, 103);

