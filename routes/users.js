var express = require("express");
var router = express.Router();
const mysql = require('mysql');
const session = require('express-session');

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

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

/** 
 * Defualt users path.  If given an incomplete query or none it redirects to the home page.
 */
router.get('/', function (req, res, next) {
    console.log(req.session.user)
    // send them to login middleware
    if (req.query && req.query.username && req.query.password) {
        next();
        return;
    }

    // if an user is an admin bring them to the admin screen
    if (req.session && req.session.user && req.session.user[0].accessLevel === 1) {
        console.log(req.session.user[0].username + "has logged in as admin");
        return res.render("adminScreen");
    }

    if (req.session && req.session.user) {
        return res.redirect("/account");
    }

    return res.redirect("/");
});

/**
 * Login/authentication middleware.  It can be used to login a user to the site.
 * @param string username
 * @param string password
 * @return json object with user info
 */

router.get('/', async function (req, res, next) {
    console.log("entering login middle ware");
    const query = 'SELECT * FROM User WHERE username = ' + pool.escape(req.query.username) +
        'AND password = ' + pool.escape(req.query.password);

    var user = await new Promise(function (resolve, reject) {
        pool.query(query, function (error, results) {
            if (error) {
                console.log(err);
                req.err = error;
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

    try {
        if (user && user.length > 0) {
            req.session.user = user;
        } else {
            delete req.session.user;
        }
    } catch (err) {
        delete req.session.user;
    }

    return res.redirect("/");
});

/**
 * Logs a user out of the site.
 * @returns boolean indicating they are logged out.
 */
router.get("/logout", function (req, res) {
    delete req.session.user;
    return res.json(true);
});

/**
 * Adds a new user to the database.
 * @param username, password, address, and email strings
 * @return int representing id where it was entered
 */
router.post("/add", async function (req, res) {
    if (await isUsernameUsed(req.body.username)) {
        return res.json(-1);
    }

    const insertId = await new Promise(function (resolve, reject) {
        const query = 'INSERT INTO User VALUES (NULL, ?, ?, ?, ?, ?)';
        const values = [
            req.body.username,
            req.body.password,
            req.body.address,
            req.body.email,
            0
        ];
        pool.query(query, values, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results.insertId);
            }
        });
    });

    return res.json(insertId);
});

/**
 * checks if the username is already in use.
 * @param string username
 * @return boolean telling if the username is used
 */
async function isUsernameUsed(username) {
    const user = await new Promise(function (resolve, reject) {
        const query = 'SELECT username FROM User WHERE username = ' + pool.escape(username);
        pool.query(query, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

    return user.length == 1;
}

module.exports = router;
