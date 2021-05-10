const { Pool } = require('pg')

const pool = new Pool({
  user: 'demarkus',
  host: 'localhost',
  database: 'hackreactor',
  password: '',
  post: 5432
})

module.exports = pool