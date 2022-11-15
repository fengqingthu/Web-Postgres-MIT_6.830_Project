const fs = require('fs');
const path = require('path');
const http = require("http");
const { promisify } = require('util')

const { Pool } = require('pg')
const Cursor = require('pg-cursor')

// =========================== Global Constant ===========================

// This is necessary to implement block reading from psql
Cursor.prototype.readAsync = promisify(Cursor.prototype.read)

const CREDENTIAL = {
    user: "postgres",
    host: "localhost",
    database: "postgres",
    port: 5432
}

const POOL = new Pool(CREDENTIAL)

const CHUNK_ROWS = 1000     // number of rows in each file chunk
const CHUNK_EXT = ".json"   // each chunk is written as json
const CACHE_DIR = "./cache"

const HOST = 'localhost'    // host that run the backend server
const SERVER_PORT = 8000    // the port to receive http request

// ========================= End of Global Constant ========================

const _init_directory = (dir) => {
    // if dir exists, rmr it and create it again
    if (fs.existsSync(dir))
        fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir)
}

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

    // process the query
    const client = await POOL.connect()     // a client per request

    if (!read) {
        // since we don't cache update query, handle it separately
        await client.query(query_text, [], () => {
            client.release()
        })
        return
    }

    // initialize the folder to cache query result
    let query_cache_dir = path.join(CACHE_DIR, query_text)

    if (fs.existsSync(query_cache_dir)) {
        // already done or currently working on query
        client.release()
        return -1
    }
    fs.mkdirSync(query_cache_dir)

    const cursor = client.query(new Cursor(query_text, []))

    let block_idx = 0
    let rows = await cursor.readAsync(CHUNK_ROWS)
    while (rows.length) {
        // async write chunk to cache folder
        const chunk_abs_path = path.resolve(path.join(query_cache_dir, block_idx.toString() + CHUNK_EXT))
        const json = JSON.stringify(rows);

        fs.writeFile(chunk_abs_path, json, 'utf8', (err) => {
            // upon finish writing each chunk, send the chunk path via http
            if (err)
                console.log("_process_request::writeFile: Unexpected: " + err)
        })

        rows = await cursor.readAsync(CHUNK_ROWS)
        block_idx++
    }

    cursor.close(() => {
        client.release()
    })

    return block_idx
}

const requestListener = async (req, res) => {
    try {
        let num_block = await _process_request(req)

        res.writeHead(200)
        res.end(num_block.toString())
    } catch (err) {
        console.log("requestListener::Unexpected!")

        res.writeHead(400)
        res.end()
    }
}

// launch the server instance
const Launch = async() => {
    console.log("Initialize cache at folder: " + CACHE_DIR)
    _init_directory(CACHE_DIR)

    console.log("========== Listening to HTTP request ==========")
    const server = http.createServer(requestListener);
    server.listen(SERVER_PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${SERVER_PORT}`)
    })
}; Launch();
