import {generateWorld} from './worldgen';
import {writeFile,readFile, readFileSync, writeFileSync, existsSync} from 'fs';
import { deflate, inflate } from 'pako';
import { MapData, MapMetadata, MapPage, MapPoint } from './mapData';

const express = require('express');
const compression = require("compression")
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
const height = 2000;
const width = 2000;
let expectedFiles = 4;

let loadCache: boolean = false;
let mapData: MapData;
let mapPageStrings: string[];

export async function start() {
    app.use(cors({
        'allowedHeaders': ['Content-Type','gzip'],
        'origin': '*',
        'preflightContinue': true
      }));
      // If the map is already generated, load it from the filesystem
      if (existsSync("./build/map.map") && loadCache) {
        mapData = await loadMap();
      }else{
        mapData = await generateWorld(width,height);
        writeMapFiles(mapData, 4);
      }

      /*if (existsSync("./build/map.map") && loadCache) {
        map = inflate(readFileSync("./build/map.map"),{to: "string"});
        mapData = JSON.parse(map) as MapData;
      }else{
        mapData = await generateWorld(width,height);
        map = JSON.stringify([mapData.height,mapData.width,mapData.maxHeight,mapData.minHeight]);
        writeFileSync("./build/map.map",deflate(map));

        let numFiles = 4;
        for(let i  = 0; i < numFiles; i++) {
          let out = mapData.mapPoints.slice((i/numFiles)*mapData.mapPoints.length, ((i+1)/numFiles)*mapData.mapPoints.length).map(el => JSON.stringify(el)).join(",");
          // add your code to store/save `out` here
          writeFileSync(`./build/map${i}.map`,deflate(out));
        }

      }*/

      //mapData = await generateWorld(width,height);
      //writeMapFiles(mapData, 4);

    // We are using our packages here
    app.use( bodyParser.json({ limit: "5000mb" }) );       // to support JSON-encoded bodies
    app.use(compression());
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true})); 

    app.use(cors());

    //You can use this to check if your server is working
    app.get('/', (req: any, res: { send: (arg0: string) => void; })=>{
    res.send("Welcome to your server")
    })


    //Route that handles login logic
    app.post('/getMap', async (req : any, res : any) =>{
        console.log("sending map...");
        let file = req.body.file;
        if (file == undefined) {
          throw new Error("No file specified");
        }else if (file < 0 || file >= expectedFiles) {
          throw new Error("Invalid file specified");
        }else if (file=="metadata") {
          console.log("sending meta...");
          res.send(mapData.mapMetadata);
        }else{
          console.log(`sending map ${file}...`);
          res.send(mapPageStrings[file]);
        }
    })

    //Start your server on a specified port
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`)
    })
}

start();

/** 
 * Function to write the *.map files from a MapData object.
 * map.map contains the MapData object, while the mapData.mapPoints array is split into 
 * map0.map, map1.map, map2.map...map(numParts).map
 */
function writeMapFiles(mapData: MapData, numParts: number) {
  mapData.mapMetadata.numParts = numParts;

  //Encode mapPoints to a string split into numParts parts, write to file
  mapPageStrings = encodeMapPoints(mapData.mapPoints, numParts);
  for(let i = 0; i < numParts; i++) {
    writeFile(`./build/map${i}.map`, mapPageStrings[i], {encoding: "utf-8"},(err) => {
      if (err) throw err;
      console.log(`MapData.mapPoints[${i}] saved!`);
    });
  }

  // Encode mapMetadata to a string and write to file
  let map = JSON.stringify(mapData.mapMetadata);
  writeFile("./build/map.map", map,{encoding: "utf-8"}, (err) => {
    if (err) throw err;
    console.log('MapData saved!');
  });
}


/**
 * Function to encode MapData.mapPoints to a string in numParts parts, to be sent to the client and stored in numParts files.
 * Needed to avoid the string length limit of the JSON.stringify function.
 * 
 * @param MapData.mapPoints The mapPoints array to be encoded.
 * @param numParts The number of parts to split the encoded array into.
 * @returns An array of 4 strings, each containing a part of the encoded mapPoints array.
 */
function encodeMapPoints(mapPoints: MapPoint[][], numParts: number): string[] {
  let out: string[] = [];

  for(let i = 0; i < numParts; i++) {
    out.push(
      JSON.stringify({
        mapPoints: mapPoints.slice((i/numParts)*mapPoints.length, ((i+1)/numParts)*mapPoints.length),
        page: i,
      }));
  }
  return out;
}

/**
 * Function to read the *.map files into a MapData object.
 * map.map contains the MapData object, while map0.map, map1.map...map(numParts).map contains the encoded mapPoints array.
 */
async function loadMap(){
  let mapMetadata: MapMetadata = JSON.parse(readFileSync("./build/map.map",{encoding: "utf-8"})) as MapMetadata;
  let mapPoints: MapPoint[][] = [];
  let i = 0;
  while(existsSync(`./build/map${i}.map`)){
    let map = readFileSync(`./build/map${i}.map`,{encoding: "utf-8"});
    mapPoints = mapPoints.concat(JSON.parse(map) as MapPoint[][]);
    i++;
  }
  expectedFiles = i+1;
  return new MapData(mapPoints,mapMetadata);
}


/** 
 * Function to read the *.map files into a MapData object.
 * map.map contains the MapData object, while map0.map, map1.map, map2.map...map(numParts).map contain the encoded mapPoints array.
 * 
 * @param numParts The number of map files to be read.
 */
function readMapFiles(numParts: number): MapData {
  let mapMetadata: MapMetadata = JSON.parse(readFileSync("./build/map.map",{encoding: "utf-8"})) as MapMetadata;
  let mapPoints: MapPoint[][] = [];

  for(let i = 0; i < numParts; i++) {
    let mapPart = readFileSync(`./build/map${i}.map`,{encoding: "utf-8"});
    mapPoints = mapPoints.concat(JSON.parse(mapPart));
  }

  return new MapData(mapPoints,mapMetadata);
}

