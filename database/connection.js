const mysql = require('mysql');
const config = require('../config/config');
const pool = mysql.createPool(config.connection);

module.exports.getConnection = () => {
    return new Promise((resolve, reject) =>{
        pool.getConnection((error, connection) => {
            if (error) return reject(error);
            resolve(connection);
        });
    })
};