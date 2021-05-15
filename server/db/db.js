const { Pool } = require('pg')
require('dotenv').config();
const pool = new Pool({
  user: 'postgres',
  host: process.env.HOST,
  database: 'catwalk',
  password: process.env.POSTGRES_PASSWORD
})

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows)
  })
})

module.exports = pool