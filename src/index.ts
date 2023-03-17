import {generateWorld} from './worldgen'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;


export function start() {
    app.use(cors({
        'allowedHeaders': ['Content-Type'],
        'origin': '*',
        'preflightContinue': true
      }));



    // We are using our packages here
    app.use( bodyParser.json({ limit: "1000mb" }) );       // to support JSON-encoded bodies

    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true})); 

    app.use(cors());

    //You can use this to check if your server is working
    app.get('/', (req: any, res: { send: (arg0: string) => void; })=>{
    res.send("Welcome to your server")
    })


    //Route that handles login logic
    app.post('/getMap', (req : any, res : any) =>{
        console.log("sending map...");

        console.log(req.body.password);
        res.send(JSON.stringify(generateWorld()));
    })

    //Start your server on a specified port
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`)
    })
}

start();
