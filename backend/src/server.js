const fs = require('fs');
const path = require('path');
const http = require('http');
const fetcher = require('./fetcher');

// =========================== Global Constants ===========================

const HOST = 'localhost';    // host that run the backend server
const SERVER_PORT = 8000;    // the port to receive http request

const CACHE_DIR = fetcher.CACHE_DIR;

const _init_directory = (dir) => {
    // if dir already exists, reset.
    if (fs.existsSync(dir))
        fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir);
}

// =========================== End Constants ===========================

// =========================== HTTP Handler ===========================

/**
 * Usage:
 * curl -X POST http://localhost:8000/api/read \
 * -H 'Content-Type: application/json' \
 * -d '{"query": SELECT * FROM ...}'
 * Response: {"num_page": 5}
 * 
 * curl -X POST http://localhost:8000/api/update \
 * -H 'Content-Type: application/json' \
 * -d '{"query": UPDATE ...}'
 * Response: {"num_page": -1}
 * 
 * curl -X POST http://localhost:8000/api/get-page \
 * -H 'Content-Type: application/json' \
 * -d '{"page_index": 0}'
 * Response: {"page_data": [JSON_DATA]} */

const requestListener = async (req, res) => {
    var segs = req.url.split('/').slice(1,);
    if (segs[0] != "api") {
        res.writeHead(400);
        res.end();
        return;
    }

    // Parse JSON body
    var arr = [];
    await req.on("data", function (data) {
        arr.push(data);
    });
    var data = Buffer.concat(arr).toString(), ret;
    try {
        var ret = JSON.parse(data);
        req.body = ret;
    } catch (err) {
        res.writeHead(400);
        res.end();
        return;
    }

    // Handle requests
    try {
        res.writeHead(200, { "Content-Type": "application/json" });
        switch (segs[1]) {
            case "read":
                let num_page = await fetcher.Query(req.body.query, true);
                res.end(JSON.stringify({ "num_page": num_page }));

            case "update":
                await fetcher.Query(req.body.query, false);
                res.end(JSON.stringify({ "num_page": -1 }));

            case "get-page":
                const page = await fetcher.GetPage(req.body.query, req.body.page_index)
                res.end(JSON.stringify({ "page_data": page }));
            default:
                res.writeHead(404);
                res.end();
        }
    } catch (err) {
        res.writeHead(500);
        res.end();
    }
}

const Launch = async () => {
    console.log(`Initializing cache folder: ${CACHE_DIR}`);
    _init_directory(CACHE_DIR);

    console.log("========== Listening to HTTP request ==========");
    const server = http.createServer(requestListener);
    server.listen(SERVER_PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${SERVER_PORT}`);
    });
}; Launch();
