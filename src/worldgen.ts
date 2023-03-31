
import alea from 'alea';
import {createNoise2D} from 'simplex-noise';
import { Color, Colors } from "./colors";
import { heightColorMap } from './heightColorMap';
import { MapData, MapMetadata, MapPoint } from './mapData';
import { temperatureToColor } from './temperatureToColor';

// create a new random function based on the seed
const prng = alea('seed234');
const simplex = createNoise2D(prng);

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

export function interpolate(a : number, b : number, x : number) : number {
  var ft = x * Math.PI;
  var f = (1 - Math.cos(ft)) * 0.5;
  return a * (1 - f) + b * f;
}


export function generateWorld(mapWidth: number, mapHeight: number): MapData {
  let data: MapPoint[][] = Array(mapWidth);
  let minHeight: number = 1;
  let maxHeight: number = -1;

  for (let x = 0; x < mapWidth; x++) {
    data[x] = Array(mapHeight);
    for (let y = 0; y < mapHeight; y++) {
      const fractalValue = fractal(x / mapWidth, y / mapHeight, 20, 0.5);
      const heightValue =  Math.round((interpolate(1, -4, fractalValue)*-1 + Number.EPSILON) * 1000) / 1000; 
      const isWater = heightValue < 0;
      const waterType = isWater ? 0:undefined;

      if (heightValue < minHeight) {
        minHeight = heightValue;
        console.log("Min Height: " + minHeight + " at " + x + "," + y);
      };
      if (heightValue > maxHeight) maxHeight = heightValue;

      const mapPoint: MapPoint = {
        x: x,
        y: y,
        h: heightValue,
        w: isWater,
        wT: waterType,
      };

      data[x][y] = mapPoint;
    }
  }
  let mapMetadata: MapMetadata = {height: mapHeight, width: mapWidth, maxHeight: maxHeight, minHeight: minHeight, name: "Test", description: "Test"};
  let mapData: MapData = new MapData(data,mapMetadata);

  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      const mapPoint = mapData.mapPoints[x][y]!;

      const steepness = Math.round((calcSteepness(x,y,mapData) + Number.EPSILON) * 1000) / 1000;
    
      mapPoint.stp = steepness;
      
      let normalizedHeight = normalizeValue(mapPoint.h!,mapData.mapMetadata.minHeight, mapData.mapMetadata.maxHeight);
      normalizedHeight = Math.round((normalizedHeight + Number.EPSILON) * 1000) / 1000;
      mapPoint.nH = normalizedHeight;
      
      const colorMap = heightColorMap.find(
          (map) => normalizedHeight >= map.heightRange[0] && normalizedHeight < map.heightRange[1]);
      mapPoint.c = colorMap ? colorMap.color : 
      Color.Error; // default to error color if no mapping found

      const equator = mapHeight/2;
      mapPoint.t = 
      Math.round(((40 - ((240/mapHeight*0.4) * Math.abs(y-equator))- (25* normalizedHeight))+ Number.EPSILON) * 1000) / 1000;;

      if (steepness >= 0.025 && !mapPoint.w) {
        mapPoint.iS = true;
        if (steepness > 0.03)
        mapPoint.iC = true;
      }
    }
  }

  return mapData;
}

function normalizeValue(value: number, minValue: number, maxValue: number): number {
  return (value - minValue) / (maxValue - minValue);
}

function calcSteepness(x: number, y: number, mapData: MapData) {
  const elevation: number = mapData.mapPoints[x][y].h!;
  let elevationChange: number = 0;
  if (y>0) elevationChange += Math.abs(elevation-mapData.mapPoints[x][y-1].h!);
  if (y<mapData.mapMetadata.height-1) elevationChange += Math.abs(elevation-mapData.mapPoints[x][y+1].h!);
  if (x>0) elevationChange += Math.abs(elevation-mapData.mapPoints[x-1][y].h!);
  if (x<mapData.mapMetadata.width-1) elevationChange += Math.abs(elevation-mapData.mapPoints[x+1][y].h!);
  const steepness = elevationChange / 4;
  return steepness;
}

