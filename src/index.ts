import {generateWorld} from './worldgen';
import {writeFile,readFile, readFileSync, writeFileSync, existsSync} from 'fs';
import { deflate, inflate } from 'pako';
import { MapData } from './mapData';

const express = require('express');
const compression = require("compression")
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
const height = 1200;
const width = 1200;

let loadCache: boolean = false;
let mapData: MapData;

export async function start() {
    app.use(cors({
        'allowedHeaders': ['Content-Type','gzip'],
        'origin': '*',
        'preflightContinue': true
      }));
      let map: string;
      if (existsSync("./build/map.map") && loadCache) {
        map = inflate(readFileSync("./build/map.map"),{to: "string"});
        mapData = JSON.parse(map) as MapData;
      }else{
        map = JSON.stringify(generateWorld(width,height));
        writeFileSync("./build/map.map",deflate(map));
      }
    // We are using our packages here
    app.use( bodyParser.json({ limit: "500mb" }) );       // to support JSON-encoded bodies
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
        res.send(map);
    })

    //Start your server on a specified port
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`)
    })
}

start();
