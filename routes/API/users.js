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
    // send them to login middleware
    if (req.query && req.query.username && req.query.password) {
        next();
        return;
    }

    console.log(req.session.user);

    // if an user is an admin bring them to the admin screen
    if (req.session && req.session.user && req.session.user.accessLevel === 1) {
        console.log(req.session.user.username + "has logged in as admin");
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

    if (Array.isArray(user) && user.length) {
        req.session.user = user[0];
        req.session.username = req.query.username;
    } else {
        delete req.session.user;
        delete req.session.username;
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
    if (!req.body.username || !req.body.password || !req.body.address || !req.body.email) {
        return res.json({ insertId: -1, success: false }).status(400);
    }

    const insertId = await isUsernameUsed(req.body.username)
        .then((isTaken) => new Promise(function (resolve, reject) {
            if (isTaken) {
                resolve(-1); // indicates a failed insertion.
            } else {
                const query = 'INSERT INTO User VALUES (NULL, ?, ?, ?, ?, ?)';
                const values = [
                    0,
                    req.body.username,
                    req.body.password,
                    req.body.address,
                    req.body.email
                ];
                pool.query(query, values, function (error, results) {
                    if (error) {
                        req.err = error;
                        reject(error);
                    } else {
                        resolve(results.insertId);
                    }
                });
            }
        }).catch((err) => {
            return -1;
        }));

    return res.json({ insertId: insertId, success: insertId > -1 }).status(insertId > -1 ? 200 : 409);
});

/**
 * checks if the username is already in use.
 * @param string username
 * @return boolean telling if the username is used
 */
async function isUsernameUsed(username) {
    return new Promise(function (resolve, reject) {
        const query = 'SELECT username FROM User WHERE username = ' + pool.escape(username);
        pool.query(query, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results.length > 0);
            }
        });
    });
}

/**
 * Updates the user's account information
 */
router.put("/update", async function () {
    if (!req.session.user) {
        return res.json({ insertId: -1, success: false }).status(400);
    }

    const insertId = await isUsernameUsed(req.body.username)
        .then((isTaken) => new Promise(function (resolve, reject) {
            if (isTaken) {

            } else {
                const query = 'UPDATE User SET username = ?, PASSWORD = ?, address = ?, email = ? WHERE userId = ?;';
                const values = [
                    req.body.username,
                    req.body.password,
                    req.body.address,
                    req.body.email,
                    req.session.user.userId
                ];
                pool.query(query, values, function (error, results) {
                    if (error) {
                        req.err = error;
                        reject(error);
                    } else {
                        resolve(results.insertId);
                    }
                });
            }
        }).catch((err) => {
            return -1; // bad query return -1 indicating a failure.
        }));

    return res.json({ insertId: insertId, success: insertId > -1 }).status(insertId > -1 ? 200 : 409);
});

/**
 * Delete a user's account.
 */
router.delete("/delete/:password", async function () {
    if (!req.session.user || !req.body.password) {
        return res.json({ insertId: -1, success: false }).status(400);
    }

    const deleteId = await new Promise(function (resolve, reject) {
        const query = 'DELETE FROM User WHERE id = ' + pool.escape(req.session.user.userId) + ' AND password = ' + pool.escape(req.body.password);
        pool.query(query, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results.insertId);
            }
        });
    }).catch((err) => {
        return -1; // bad query return -1 indicating a failure.
    });

    if (deleteId > -1) {
        delete req.session.user;
        delete req.session.username;
    }

    return res.json({ deleteId: deleteId, success: deleteId > -1 }).status(deleteId > -1 ? 200 : 409);
});

/**
 * Sends the user to the shopping cart page if they are logged in.
 */
router.get("/shoppingcart", function (req, res, next) {
    if (req.session.user) {
        return res.render("shoppingCart");
    }

    return res.redirect("/");
});

module.exports = router;
