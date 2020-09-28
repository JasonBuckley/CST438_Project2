var express = require('express');
var router = express.Router();
const mysql = require('mysql');

// gets the config settings for the db
const sqlConfig = {
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    database: process.env.SQL_DATABASE
};

const pool = mysql.createPool(sqlConfig);

/**
 * Gets all the products
 * @Returns json object containing all products
*/
router.get('/', async function (req, res) {
    var products = await new Promise(function (resolve, reject) {
        const query = `SELECT * FROM Product;`
        pool.query(query, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

    res.json(products);
});

module.exports = router;
