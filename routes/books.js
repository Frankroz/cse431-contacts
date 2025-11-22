const express = require("express");
const router = express.Router();

const bookController = require("../controllers/books");

// GET a single book by ID
router.get("/", bookController.getAllBooks);

// GET all books
router.get("/:id", bookController.getSingle);

// POST a new book
router.post("/", bookController.createBooks);

// PUT update an book by ID
router.put("/:id", bookController.updateBooks);

// DELETE an book by ID
router.delete("/:id", bookController.deleteBooks);

module.exports = router;
