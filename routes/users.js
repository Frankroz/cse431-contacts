const express = require("express");
const router = express.Router();

const userController = require("../controllers/users")

router.get("/:id", userController.getSingle)

router.get("/", userController.getAllUsers)

module.exports = router;