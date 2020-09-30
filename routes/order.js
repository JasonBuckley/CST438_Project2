var express = require('express');
var router = express.Router();
const mysql = require('mysql');

// gets the config settings for the db
const sqlConfig = {
    user: 'dj8w7oh4eost4s0b',
    password: 'nnnn0lagb3zsk91h',
    host: 'ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    database: 'kysos8b75tltyw1x'
};

// creates a pool to handle query requests.
const pool = mysql.createPool(sqlConfig);

/**
 * Retrieving page
 */
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('order', { title: 'Orders' });
});

/**
 * Add to product order
 */

// TODO: figure out how to get information from product page
router.post('/add', function(req, res, next) {
    let userId = req.body.user_id;
    let productId = req.body.product_id;
    let orderDate = req.body.order_date;
    let orderTime = req.body.order_time;
    let amount = req.body.amount;

    //query to add order in

    let query = "INSERT INTO Product_Order VALUES("+userId+", "+productId+", "+orderDate+", "+orderTime+", "+amount+")";


    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
});

/**
 * Update product if user wants more
 */

/**
 * Delete an order
 */

module.exports = router;