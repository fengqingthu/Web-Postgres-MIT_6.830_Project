const fs = require('fs');
const path = require('path');
const http = require('http');
const { promisify } = require('util');
const { Pool } = require('pg');
const Cursor = require('pg-cursor');

import {Query, GetPage} from './fetcher';

// =========================== Global Constants ===========================

export const CACHE_DIR = "./cache";

const HOST = 'localhost';    // host that run the backend server
const SERVER_PORT = 8000;    // the port to receive http request

const _init_directory = (dir) => {
    // if dir exists, reset.
    if (fs.existsSync(dir))
        fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir);
}

// =========================== End Constants ===========================

const _process_request = async (req) => {
    // parse request

    // get the sql query from body
    let body = ''
    await req.on('data', (data) => {
        body += data
    })
    await req.on('end', () => {
    })

    let fields = req.url.split('/').slice(1,)

    let query_text = body
    let read = (fields[0] === 'read')

    console.log(`Get HTTP request: Query: ${query_text}, Read-only: ${read}`)

    
}

// =========================== HTTP Handler ===========================
const requestListener = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    var segs = req.url.split('/').slice(1,);
    console.log(`Receive request:${segs}`);

    try {
        res.writeHead(200);
        switch(segs[0]) {
            case "read":

                let num_block = await Query()
        }

        let num_block = await _process_request(req)

        res.writeHead(200)
        res.end(num_block.toString())
    } catch (err) {
        console.log("requestListener::Unexpected!")

        res.writeHead(400)
        res.end()
    }
}

const Launch = async () => {
    console.log(`Initializing cache folder: ${CACHE_DIR}`)
    _init_directory(CACHE_DIR)

    console.log("========== Listening to HTTP request ==========")
    const server = http.createServer(requestListener);
    server.listen(SERVER_PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${SERVER_PORT}`)
    })
}; Launch();
