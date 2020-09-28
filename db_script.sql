DROP TABLE IF EXISTS User;

CREATE TABLE User(
	userId int AUTO_INCREMENT,
	username varchar(32),
	password varchar(32),
	address varchar(128),
	email varchar(128),

	PRIMARY KEY(userId)
);

DROP TABLE IF EXISTS Product;

CREATE TABLE Product(
	productId int AUTO_INCREMENT,
	name varchar(64),
	info varchar(128),
	pictureUrl varchar(255),
	stock smallInt,
	cost numeric(7, 2), 

	PRIMARY KEY (productId)
);

DROP TABLE IF EXISTS Product_Order;

CREATE TABLE Product_Order(
	orderId int AUTO_INCREMENT,
	userId int,
	productId int,
	orderDate date,
	orderTime time,
	amount smallInt,

	PRIMARY KEY(orderId),
	FOREIGN KEY(userId) REFERENCES User (userId) ON DELETE CASCADE,
	FOREIGN KEY(productId) REFERENCES Product (productId) ON DELETE CASCADE
);