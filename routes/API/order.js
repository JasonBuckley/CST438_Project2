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
 * Gets all the orders if there is no id in query
 * @Returns json object containing all product_orders
 */
router.get('/', async function (req, res, next) {
    if (req.query && req.query.id) {
        next();
        return;
    }

    if (req.query.page < 0) {
        return res.json({ success: false }).status(400);
    }

    var orders = await new Promise(function (resolve, reject) {
        const query = `SELECT * FROM Product_Order;`
        pool.query(query, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

    res.json({ success: (Array.isArray(orders) && orders.length > 0), orders: orders });
});

/**
 * Gets order given orderId.
 * @Parameter req.query.id orderId
 * @Return returns orders and switches to a page with order info.
 */
router.get('/', async function (req, res, next) {
    var order = await new Promise(function (resolve, reject) {
        const query = 'SELECT * FROM Product_Order WHERE orderId = ?';
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
    order = Array.isArray(order) && order.length ? JSON.stringify(order[0]) : "'NONE'";
    res.render('orderPage', { order: order });
});

/**
 * Add order
 */
router.post("/add", async function (req, res) {
    const orderId = await new Promise(function (resolve, reject) {
        const query = 'INSERT INTO Product_Order VALUES (NULL, ?, ?, ?, ?, ?)';
        const values = [
            req.body.userId,
            req.body.productId,
            req.body.date,
            req.body.time,
            req.body.amount
        ];
        pool.query(query, values, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results.orderId);
            }
        });
    });
    return res.json(orderId);
});

/**
 * Delete an order given orderId
 */
router.get("/delete/:id", async function (req, res) {
    const deletedId = await new Promise(function (resolve, reject) {
        const query = 'DELETE FROM Product_Order WHERE orderId = ?';
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
    return res.send(deletedId + "has been Deleted");
});

module.exports = router;