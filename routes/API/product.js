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

// creates a pool to handle query requests.
const pool = mysql.createPool(sqlConfig);

/**
 * Gets all the products if there is no id in query
 * @Returns json object containing all products
*/
router.get('/', async function (req, res, next) {
    if (req.query && req.query.id) {
        next();
        return;
    }

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

/**
 * Gets a product given a productId.
 * @Parameter req.query.id productId
 * @Return returns a product and switches to a page with product info.
 */
router.get('/', async function (req, res, next) {
    var product = await new Promise(function (resolve, reject) {
        const query = 'SELECT * FROM Product WHERE productId = ?';
        const values = [req.query.id];

        pool.query(query, values, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

    res.render('productPage', { product: product && product.length ? JSON.stringify(product["0"]) : JSON.stringify({})});
});

module.exports = router;
