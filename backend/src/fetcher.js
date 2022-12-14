const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { Pool } = require('pg');
const Cursor = require('pg-cursor');

// This is necessary to implement block reading from psql
Cursor.prototype.readAsync = promisify(Cursor.prototype.read);

const CREDENTIAL = {
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password:"juduo971209",
    port: 5432
};

const CACHE_DIR = "./cache"

const CHUNK_ROWS = 100;     // number of rows in each file chunk
const CHUNK_EXT = ".json";   // each chunk is written as json

const POOL = new Pool(CREDENTIAL);

const POLLING_INTERVAL = 1000   // in millisecond
const MAX_RETRY_TIMES = 10

const ONE_MILLION = 1000000

/** 
 * Send a synchronous SQL query to Postgres, fetch the results in a 
 * streaming manner, asynchronously cache chunks in disk, return the
 * number of chunks cached otherwise -1. */
const Query = async (query_text, is_read) => {
    // process the query
    const client = await POOL.connect();     // a client per request

    if (!is_read) {
        // since we don't cache update query, handle it separately
        await client.query(query_text, [], () => {
            client.release();
        });
        return -1;
    }

    // initialize the folder to cache query result
    let query_cache_dir = path.join(CACHE_DIR, query_text);

    if (fs.existsSync(query_cache_dir)) {
        // already done or currently working on query
        client.release();
        return -1;
    }
    fs.mkdirSync(query_cache_dir);

    const cursor = client.query(new Cursor(query_text, []));

    let heapUsages = [];

    let startTime = Date.now()

    let chunk_idx = 0;
    let rows = await cursor.readAsync(CHUNK_ROWS);

    let queryFirstChunkTime = Date.now() - startTime;
    console.log("[Query] Query first chunk time:", queryFirstChunkTime.toString(), "ms")

    while (rows.length) {
        // record the heap memory usages at each iteration
        heapUsages.push(process.memoryUsage().heapUsed);

        // async write chunk to cache folder
        const chunk_abs_path = path.resolve(path.join(query_cache_dir, chunk_idx.toString() + CHUNK_EXT));
        const json = JSON.stringify(rows);

        fs.writeFile(chunk_abs_path, json, 'utf8', (err) => {
            // upon finish writing each chunk, send the chunk path via http
            if (err)
                console.log("_process_request::writeFile: Unexpected: " + err);

            const firstChunkAbsPath = path.resolve(path.join(query_cache_dir, "0" + CHUNK_EXT));
            if (chunk_abs_path === firstChunkAbsPath) {
                let cacheFirstChunkTime = Date.now() - startTime;
                console.log("[Query] Cache first chunk time:", cacheFirstChunkTime.toString(), "ms");
            }
        });

        rows = await cursor.readAsync(CHUNK_ROWS);
        chunk_idx++;
    }

    cursor.close(() => {
        client.release();
    })

    const recordCacheTime = async() => {
        // Check when all files get cached
        // FIXME: currently use busy waiting
        let last_chunk_idx = chunk_idx - 1;
        const last_chunk_abs_path = path.resolve(path.join(query_cache_dir, last_chunk_idx.toString() + CHUNK_EXT));
        while (!fs.existsSync(last_chunk_abs_path)) {
            // very busy
        }
        const cacheAllChunksTime = Date.now() - startTime;
        console.log("[Query] Cache all chunks time:", cacheAllChunksTime.toString(), "ms");
    }; recordCacheTime();

    let queryAllChunksTime = Date.now() - startTime;
    console.log("[Query] Query all chunks time:", queryAllChunksTime.toString(), "ms");

    // heap memory statistics computation
    let sum = heapUsages.reduce((a, b) => a + b, 0);
    let avg = (sum / heapUsages.length) || 0;
    let max = Math.max.apply(Math, heapUsages);
    let peakUsage = (max / ONE_MILLION).toFixed(2);
    let avgUsage = (avg / ONE_MILLION).toFixed(2);
    console.log("[Query] Heap Memory usage:", `Peak: ${peakUsage} MB, Avg: ${avgUsage} MB`);

    return chunk_idx;
}

const GetPage = async (query_text, pgIdx) => {
    console.log(`[GetPage] Fetching page ${query_text}/${pgIdx}`);

    let query_cache_dir = path.join(CACHE_DIR, query_text);

    let count = 0;
    while (count < MAX_RETRY_TIMES && !fs.existsSync(query_cache_dir)) {
        // query haven't initiated, busy polling
        await _sleep(POLLING_INTERVAL);
    }
    if (count == MAX_RETRY_TIMES) {
        return null;
    }

    let chunk_path = path.join(query_cache_dir, pgIdx + CHUNK_EXT);

    // FIXME: currently use busy polling
    count = 0;
    while (count < MAX_RETRY_TIMES) {
        if (fs.existsSync(chunk_path)) {
            try {
                const data = fs.readFileSync(chunk_path, 'utf-8');
                return JSON.parse(data);
            } catch (err) {
                throw err;
            }
        } else {
            // query is still working
            await _sleep(POLLING_INTERVAL);
        }
        count++;
    }

    return null;
}

function _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    CACHE_DIR: CACHE_DIR,
    Query: Query,
    GetPage: GetPage,
}
