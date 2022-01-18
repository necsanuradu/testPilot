var express = require("express");
var router = express.Router();
var fs = require("fs");

router.post("/", function (req, res, next) {
  // res.render("index", { text: "red" });
  console.log("---", req.query.name, "----");
  console.log("---", req.body.component, "----");
  fs.readFile(process.cwd() + req.body.component, function (err, data) {
    if (err == null) {
      res.send(data);
    } else {
      res.send(""); //err
    }
  });
});

module.exports = router;
