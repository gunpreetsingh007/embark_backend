"use strict";
require('dotenv').config({path: './.env'});
module.exports = {
   
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": process.env.DB_DIALECT || "mysql",
    "logging": true,
    "pool": {
        max: 150,
        min: 0,
        idle: 30000,
        acquire: 30000,
        //evict: 30000
    }
}
  
