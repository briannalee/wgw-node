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
  normalizedHeight: number; // Normalized height value 0-1
  overlayTemp: RGBA; // Overlay color value for Temperature
  color: RGBA; // Tile color
}

export interface MapMetadata {
  [x: string]: any;
  name: string; // Name of the map
  description: string; // Description of the map
  height: number; // Height of the map
  width: number; // Width of the map
  maxHeight: number; // Maximum height of the map
  minHeight: number; // Minimum height of the map

  // numParts is the number of parts the MapPoints[][] array is divided into in the MapData class, 
  // when saving/loading or sending to client.
  numParts?: number; 
}

export interface MapPage {
  mapPoints: MapPoint[][];
  page: number;
}


export class MapData {
  mapPoints: MapPoint[][];
  mapMetadata: MapMetadata;
  
  constructor(mapPoints: MapPoint[][], metadata: MapMetadata) {
      this.mapMetadata = metadata;
      this.mapPoints = mapPoints;
  }
}
