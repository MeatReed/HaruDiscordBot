const mysql = require('mysql2')

module.exports = {
  init: () => {
    const poolOptions = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    }
    const poolRequest = mysql.createPool(poolOptions)
    const promiseRequest = poolRequest.promise()
    return {
      poolRequest,
      promiseRequest,
    }
  },
}
