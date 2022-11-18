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
    port: 5432
};

const CACHE_DIR = "./cache"

const CHUNK_ROWS = 1000;     // number of rows in each file chunk
const CHUNK_EXT = ".json";   // each chunk is written as json

const POOL = new Pool(CREDENTIAL);

const POLLING_INTERVAL = 1000   // in millisecond
const MAX_RETRY_TIMES = 5

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

    let chunk_idx = 0;
    let rows = await cursor.readAsync(CHUNK_ROWS);
    while (rows.length) {
        // async write chunk to cache folder
        const chunk_abs_path = path.resolve(path.join(query_cache_dir, chunk_idx.toString() + CHUNK_EXT));
        const json = JSON.stringify(rows);

        fs.writeFile(chunk_abs_path, json, 'utf8', (err) => {
            // upon finish writing each chunk, send the chunk path via http
            if (err)
                console.log("_process_request::writeFile: Unexpected: " + err);
        });

        rows = await cursor.readAsync(CHUNK_ROWS);
        chunk_idx++;
    }

    cursor.close(() => {
        client.release();
    })

    return chunk_idx;
}

const GetPage = async (query_text, pgIdx) => {
    console.log(`Fetching page ${query_text}/${pgIdx}`);

    let query_cache_dir = path.join(CACHE_DIR, query_text);

    if (!fs.existsSync(query_cache_dir)) {
        // query haven't initiated
        Query(query_text, true);
    }

    let chunk_path = path.join(query_cache_dir, pgIdx + CHUNK_EXT);

    // FIXME: currently use busy polling
    let count = 0;
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
