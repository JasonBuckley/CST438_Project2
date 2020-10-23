const session = require("express-session");

const express = require("express");
const router = express.Router();

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

router.get("/", function (req, res, next) {
  if (req.session.user) {
    res.render("home", { title: "Webstore", username: req.session.username });
  } else {
    res.render("home", { title: "Webstore" });
  }
});

module.exports = router;
