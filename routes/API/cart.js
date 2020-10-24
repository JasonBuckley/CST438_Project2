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
 * Gets all cartItems for a specific user
 **/
router.get("/all", async function (req, res) {
    if (!req.session.user) {
        return res.redirect("/");
    }

    const cartItems = await new Promise(function (resolve, reject) {
        const query = 'SELECT c.cartId, c.amount, p.* FROM Cart c NATURAL JOIN Product p WHERE userId = ?;';
        const values = req.session.user.userId;
        pool.query(query, values, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results);
            }
        });
    }).catch((err) => {
        return res.json("EMPTY");
    });

    return res.json(cartItems);
});

/**
 * adds an item to the cart
 **/
router.post("/add", async function (req, res) {
    if (!req.session.user) {
        return res.json(-1);
    }

    const insertId = await new Promise(function (resolve, reject) {
        const query = 'INSERT INTO Cart VALUES(NULL, ?, ?, ?);';
        const values = [
            req.session.user.userId,
            req.body.productId,
            req.body.amount ? req.body.amount : 1
        ];
        pool.query(query, values, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results.insertId);
            }
        });
    }).catch((err) => {
        return -1;
    });

    return res.json(insertId);
});

/**
 * updates a cart item
 **/
router.put("/update", async function (req, res) {
    if (!req.session.user) {
        return res.json(-1);
    }

    const affectedRows = await new Promise(function (resolve, reject) {
        const query = 'UPDATE Cart SET amount = ? WHERE cartId = ?;';
        const values = [
            req.body.amount,
            req.body.cartId
        ];
        pool.query(query, values, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results.affectedRows);
            }
        });
    }).catch((err) => {
        return -1;
    });

    return res.json(affectedRows);
});

/**
 * removes an item from the cart
 **/
router.delete("/remove", async function (req, res) {
    if (!req.session.user || !req.body.cartId) {
        return res.json(-1);
    }

    const affectedRows = await new Promise(function (resolve, reject) {
        const query = 'DELETE FROM Cart WHERE cartId = ? AND userId = ?;';
        const values = [
            req.body.cartId,
            req.session.user.userId
        ];
        pool.query(query, values, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results.affectedRows);
            }
        });
    }).catch((err) => {
        return -1;
    });

    return res.json(affectedRows);
});

module.exports = router;