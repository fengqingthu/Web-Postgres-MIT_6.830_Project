const fs = require('fs');
const path = require('path');

import { CACHE_DIR } from './server';

const POOL = new Pool(CREDENTIAL);

// This is necessary to implement block reading from psql
Cursor.prototype.readAsync = promisify(Cursor.prototype.read);

const CREDENTIAL = {
    user: "postgres",
    host: "localhost",
    database: "postgres",
    port: 5432
};

const CHUNK_ROWS = 1000;     // number of rows in each file chunk
export const CHUNK_EXT = ".json";   // each chunk is written as json

/** 
 * Send a synchronous SQL query to Postgres, fetch the results in a 
 * streaming manner, asynchronously cache chunks in disk, return the
 * number of chunks cached otherwise -1. */
export const Query = async (query_text, is_read) => {
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

    let block_idx = 0;
    let rows = await cursor.readAsync(CHUNK_ROWS);
    while (rows.length) {
        // async write chunk to cache folder
        const chunk_abs_path = path.resolve(path.join(query_cache_dir, block_idx.toString() + CHUNK_EXT));
        const json = JSON.stringify(rows);

        fs.writeFile(chunk_abs_path, json, 'utf8', (err) => {
            // upon finish writing each chunk, send the chunk path via http
            if (err)
                console.log("_process_request::writeFile: Unexpected: " + err);
        });

        rows = await cursor.readAsync(CHUNK_ROWS);
        block_idx++;
    }

    cursor.close(() => {
        client.release();
    })

    return block_idx;
}

export const GetPage = async (query_text, pgIdx) => {
    console.log(`Fetching page ${pgIdx}`);

   /*  while (true) {
        if (query in queryResult) {
            pgIdx = pgIdx >= queryResult[query]? queryResult[query] : pgIdx;
    
            try {
                const data = readFileSync(`${DATA_DIR}${query}/${pgIdx}.json`, "utf-8");
                return JSON.parse(data);
            } catch (err) {
                throw err;
            }
        } else if (existsSync(`${DATA_DIR}${query}/${pgIdx}.json`)) {
            try {
                const data = readFileSync(`${DATA_DIR}${query}/${pgIdx}.json`, "utf-8");
                return JSON.parse(data);
            } catch (err) {
                throw err;
            }
        }

        await sleep(POLLING_INTERVAL);
    } */
}