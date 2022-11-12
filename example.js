'use strict'

const db = require('./db')

const num = 4

db.query('SELECT * FROM scores WHERE sid < $1', [num], (err, result) => {
    console.log(err, result)
})
