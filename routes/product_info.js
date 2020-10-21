const express = require("express");
const router = express.Router();

router.get("/:productId", function (req, res, next) {
  let id = req.params.productId;
  // request.params.username;
  console.log("From prod info: ", id);

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
