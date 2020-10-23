var express = require('express');
var router = express.Router();
const mysql = require('mysql');


CREATE TABLE Cart(
    cartId INT AUTO_Increment,
    userId INT,
    productId INT,
    amount INT NOT NULL,
    PRIMARY KEY(cartId),
    FOREIGN KEY(userId) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY(productId) REFERENCES Product(productId) ON DELETE CASCADE
);








module.exports = router;