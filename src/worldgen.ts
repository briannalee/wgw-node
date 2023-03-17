import {createNoise2D, NoiseFunction2D} from 'simplex-noise';
const simplex = createNoise2D();
const steepHeightValue: number = 500;

export function fractal(x : number, y: number, octaves: number, persistence: number) : number {
  var total = 0;
  var frequency = 1;
  var amplitude = 1;
  var maxValue = 0;
  for (var i = 0; i < octaves; i++) {
    total += simplex(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }
  return total / maxValue;
}

interface MapPoint {
  x: number; // X-coordinate of the point
  y: number; // Y-coordinate of the point
  height: number; // Height of the point above sea level
  isWater: boolean; // Whether the point is covered by water
  waterType?: "salt" | "fresh"; // The type of water covering the point (optional)
  temperature?: number; // Temperature at the point (optional)
  precipitation?: number; // Precipitation at the point (optional)
  vegetation?: string[]; // Types of vegetation at the point (optional)
  soilType?: string; // Type of soil at the point (optional)
  population?: number; // Population density at the point (optional)
  steepness?: number; // How steep is the point?
}

class MapData {
  mapPoints: MapPoint[][];
  maxHeight: number;
  minHeight: number;

  constructor(mapPoints: MapPoint[][], maxHeight: number, minHeight: number) {
    this.mapPoints = mapPoints;
    this.maxHeight = maxHeight;
    this.minHeight = minHeight;
  }
}

export function interpolate(a : number, b : number, x : number) : number {
  var ft = x * Math.PI;
  var f = (1 - Math.cos(ft)) * 0.5;
  return a * (1 - f) + b * f;
}

export function generateWorld(): MapData {
  const width = 1000;
  const height = 1000;
  const data: MapPoint[][] = [];
  let minHeight: number = 1;
  let maxHeight: number = -1;

  for (let x = 0; x < width; x++) {
    data[x] = [];
    for (let y = 0; y < height; y++) {
      const fractalValue = fractal(x / width, y / height, 28, 0.5);
      const heightValue = interpolate(1, -4, fractalValue)*-1;
      const isWater = heightValue < 0;
      const waterType = isWater ? (Math.random() < 0.5 ? "salt" : "fresh") : undefined;
      const heightNorth = interpolate(1,-4,fractal(x / width, (y - 1) / height, 20, 0.5))*-1;
      const heightSouth = interpolate(1,-4,fractal(x / width, (y + 1) / height, 20, 0.5))*-1;
      const heightEast = interpolate(1,-4,fractal((x + 1) / width, y / height, 20, 0.5))*-1;
      const heightWest = interpolate(1,-4,fractal((x - 1) / width, y / height, 20, 0.5))*-1;

      const heightValues = [heightNorth, heightSouth, heightEast, heightWest];
      let steepnessSum = 0;

      for (const value of heightValues) {
        steepnessSum += Math.abs(heightValue - value);
      }

      const overallSteepness = steepnessSum / heightValues.length;
      const steepness = normalizeValue(overallSteepness,0,0.2);

      if (heightValue < minHeight) minHeight = heightValue;
      if (heightValue > maxHeight) maxHeight = heightValue;
      const equator = height/2;
      const temperature = 40 - ((240/height*0.5) * Math.abs(y-equator))- (5* heightValue);
     

      const mapPoint: MapPoint = {
        x: x,
        y: y,
        height: heightValue,
        isWater: isWater,
        waterType: waterType,
        steepness: steepness,
        temperature: temperature,
      };

      data[x][y] = mapPoint;
    }
  }

  function normalizeValue(value: number, minValue: number, maxValue: number): number {
    return (value - minValue) / (maxValue - minValue);
  }

  console.log("Equator:" + data[500][500].temperature);
  console.log("North Pole:" + data[500][0].temperature);
  console.log("South Pole:" + data[500][999].temperature);
  return new MapData(data,maxHeight,minHeight);
}

