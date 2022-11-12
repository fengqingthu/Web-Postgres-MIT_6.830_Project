const { Pool } = require('pg')

// credentials for connecting to psql
const credentials = {
    user: "postgres",
    host: "localhost",
    database: "postgres",
    port: 5432
}

const pool = new Pool(credentials)

module.exports = {
    query: (text, params, callback) => {
        const start = Date.now()
        return pool.query(text, params, (err, res) => {
            const duration = Date.now() - start
            console.log('executed query', {text, duration})
            callback(err, res)
        })
    },

    getClient: (callback) => {
        pool.connect((err, client, done) => {
            callback(err, client, done)
        })
    }
}