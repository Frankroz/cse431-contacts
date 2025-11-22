const express = require("express");
const router = express.Router();
const authorsController = require("../controllers/authors");

// GET all authors
router.get("/", authorsController.getAllAuthors);

// GET a single author by ID
router.get("/:id", authorsController.getSingleAuthor);

// POST a new author
router.post("/", authorsController.createAuthor);

// PUT update an author by ID
router.put("/:id", authorsController.updateAuthor);

// DELETE an author by ID
router.delete("/:id", authorsController.deleteAuthor);

module.exports = router;
