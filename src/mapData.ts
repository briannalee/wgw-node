import { Color, Colors } from "./colors";

export interface MapPoint {
  x: number; // X-coordinate of the point
  y: number; // Y-coordinate of the point
  h?: number; // Height of the point above sea level
  w?: boolean; // Whether the point is covered by water
  wT?: number; // The type of water covering the point (optional)
  t?: number; // Temperature at the point (optional)
  rf?: number; // Precipitation at the point (optional)
  vg?: number; // Types of vegetation at the point (optional)
  st?: number; // Type of soil at the point (optional)
  pop?: number; // Population density at the point (optional)
  stp?: number; // How steep is the point?
  nH?: number; // Normalized height value 0-1
  c?: Color; // Index of the color in the enum Colors
  iS?: boolean; // Whether the point is steep
  iC?: boolean; // Whether the point is a cliff
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
