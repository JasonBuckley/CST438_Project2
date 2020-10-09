const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  if (req.session.user) {
    res.render("product_info", {
      title: "Webstore - Home",
      username: req.session.username,
    });
  } else {
    res.render("product_info", { title: "Webstore" });
  }
});

module.exports = router;
