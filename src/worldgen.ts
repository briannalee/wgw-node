
import alea from 'alea';
import {createNoise2D} from 'simplex-noise';
import { MapData, MapPoint } from './mapData';
import { temperatureToColor } from './temperatureToColor';

// create a new random function based on the seed
const prng = alea('seed');
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
      const fractalValue = fractal(x /1000, y / 1000, 20, 0.5);
      const heightValue =  Math.round((interpolate(1, -4, fractalValue)*-1 + Number.EPSILON) * 1000) / 1000; 
      const isWater = heightValue < 0;
      const waterType = isWater ? (Math.random() < 0.5 ? "salt" : "fresh") : undefined;

      if (heightValue < minHeight) minHeight = heightValue;
      if (heightValue > maxHeight) maxHeight = heightValue;
      const equator = mapHeight/2;
      const temperature = Math.round(((40 - ((240/mapHeight*0.5) * Math.abs(y-equator))- (5* heightValue))+ Number.EPSILON) * 1000) / 1000;;
      const tempColor = temperatureToColor(temperature);

      const mapPoint: MapPoint = {
        x: x,
        y: y,
        height: heightValue,
        isWater: isWater,
        waterType: waterType,
        temperature: temperature,
        overlayTemp: tempColor,
      };

      data[x][y] = mapPoint;
    }
  }
  let mapData: MapData = new MapData(data,maxHeight,minHeight,mapWidth,mapHeight);

  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      
      mapData.mapPoints[x][y].steepness = Math.round((calcSteepness(x,y,mapData) + Number.EPSILON) * 1000) / 1000;
      const normalizedHeight = normalizeValue(mapData.mapPoints[x][y].height,mapData.minHeight, mapData.maxHeight);
      mapData.mapPoints[x][y].normalizedHeight = Math.round((normalizedHeight + Number.EPSILON) * 1000) / 1000;
    }
  }

  return mapData;
}

function normalizeValue(value: number, minValue: number, maxValue: number): number {
  return (value - minValue) / (maxValue - minValue);
}

function calcSteepness(x: number, y: number, mapData: MapData) {
  const elevation: number = mapData.mapPoints[x][y].height;
  let elevationChange: number = 0;
  if (y>0) elevationChange += Math.abs(elevation-mapData.mapPoints[x][y-1].height);
  if (y<mapData.height-1) elevationChange += Math.abs(elevation-mapData.mapPoints[x][y+1].height);
  if (x>0) elevationChange += Math.abs(elevation-mapData.mapPoints[x-1][y].height);
  if (x<mapData.width-1) elevationChange += Math.abs(elevation-mapData.mapPoints[x+1][y].height);
  const steepness = elevationChange / 4;
  return steepness;
}
