var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const { route } = require('..');

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


router.get("/checkout", async function (req, res) {
    if (!req.session.user && !req.query.processedOrders) {
        res.send("Must be Logged In");
    }

    console.log(req.query.processedOrders);
   
    var orders = await new Promise(function (resolve, reject) {
        var orderIds = req.query.processedOrders.split(",");
        var tokens = new Array(orderIds.length).fill('?').join(',');
        const query = `SELECT * FROM Product_Order WHERE orderId in (${tokens});`
        const values = orderIds;

        pool.query(query, values, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results);
            }
        });
    }).catch((err) => {
        return [];
    });

    // change to res.render("/pathOfCheckoutPage", {orders: orders}) to send information to a checkout page
    return res.send(JSON.stringify(orders));
});

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
    let currentstock;
    if (!req.session.user || !req.body.productId || !req.body.amount) { // only users can make orders
        return res.json(-1);
    }

    const orderId = await new Promise(function (resolve, reject) { // makes sure the request is less then the stock
        if (req.body.amount <= 0) {
            reject(req.body.productId + ": Can not send us stock");
        } else {
            const query = `SELECT stock FROM Product WHERE productId = ?;`;
            const values = [
                req.body.productId,
            ];

            pool.query(query, values, function (error, results) {
                if (error) {
                    req.err = error;
                    reject(error);
                } else {
                    if (Array.isArray(results) && results.length < 1) {
                        reject("Invalid Product Id");
                        return;
                    }

                    if (results[0].stock < req.body.amount) {
                        currentstock = results[0].stock;
                        reject(req.body.productId + ": not enough stock");
                    }
                    resolve(true);
                }
            });
        }
    }).then(() => new Promise(function (resolve, reject) { // makes the order
        const query = `INSERT INTO Product_Order VALUES (NULL, ?, ?, CURDATE(), CURRENT_TIME(), ?);`;
        const values = [
            req.session.user.userId,
            req.body.productId,
            req.body.amount
        ];

        pool.query(query, values, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results.insertId);
            }
        });
    })).then((insertId) => new Promise(function (resolve, reject) { // if the order is successfully made reduce the stock of the product accordingly
        let query = `UPDATE Product SET stock = stock - ? WHERE productId = ?;`;
        const values = [
            req.body.amount,
            req.body.productId
        ];

        pool.query(query, values, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(insertId);
            }
        });
    })).catch((err) => {
        console.log(err);
        return -1; // bad query return -1 indicating a failure.
    });

    if (currentstock) {
        return res.json(-1 - currentstock); // doing the opposite minus 1 on the client side will give product stock.
    }

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