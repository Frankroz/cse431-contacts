const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.use("/books", require("./books"));
router.use("/authors", require("./authors"));

module.exports = router;
