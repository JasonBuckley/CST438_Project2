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
    console.log("logged in!!!!!");
  } else {
    console.log("Not logged in!!!");
  }
  res.render("home", { title: "Webstore - Home" });
});

module.exports = router;
