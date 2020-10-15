const mysql = require('mysql');
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("hbs");

hbs.registerPartials(path.join(__dirname, "views/partials"));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/API/users");
var productRouter = require("./routes/API/product");
var homeRouter = require("./routes/home");
var productInfoRouter = require("./routes/product_info");
var orderRouter = require("./routes/API/order");
var app = express();

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const sqlConfig = mysql.createConnection ({
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
  database: process.env.SQL_DATABASE
});

// creates a pool to handle query requests.
const pool = mysql.createPool(sqlConfig);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeRouter);
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.use("/product-info", productInfoRouter);
app.use("/order", orderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
