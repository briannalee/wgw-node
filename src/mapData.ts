import { RGBA } from "./colors";

export interface MapPoint {
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
  normalizedHeight?: number; // Normalized height value 0-1
  overlayTemp?: RGBA; // Overlay color value for Temperature
}

export class MapData {
  mapPoints: MapPoint[][];
  maxHeight: number;
  minHeight: number;
  width: number;
  height: number;
  
  constructor(mapPoints: MapPoint[][], maxHeight: number, minHeight: number, width: number, height: number) {
    this.mapPoints = mapPoints;
    this.maxHeight = maxHeight;
    this.minHeight = minHeight;
    this.width = width;
    this.height = height;
  }
}
