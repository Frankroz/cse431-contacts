const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const handleServerError = (res, error) => {
  console.error("Server Error:", error);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: error.message });
};

// Helper function to validate MongoDB ObjectId format
const validateObjectId = (id, res) => {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({
      error: "Invalid ID format. Must be a 24-character hexadecimal string.",
    });
    return false;
  }
  return true;
};

// [GET] /books/ - Get all books
const getAllBooks = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection("Books")
      .find()
      .toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

// [GET] /books/:id - Get a single book by ID
const getSingle = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!validateObjectId(bookId, res)) return;

    const result = await mongodb
      .getDb()
      .db()
      .collection("Books")
      .findOne({ _id: new ObjectId(bookId) });

    if (!result) {
      return res.status(404).json({ error: "Book not found." });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

// [POST] /books/ - Create a new book
const createBooks = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is missing." });
    }

    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      pages: req.body.pages,
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("Books")
      .insertOne(book);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ error: "Failed to create book." });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error:
          "Conflict: A document with that unique field value already exists.",
      });
    }
    handleServerError(res, error);
  }
};

// [PUT] /books/:id - Update an existing book by ID
const updateBooks = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!validateObjectId(bookId, res)) return;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is missing." });
    }

    const updatedData = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      pages: req.body.pages,
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("Books")
      .updateOne({ _id: new ObjectId(bookId) }, { $set: updatedData });

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else if (response.matchedCount === 0) {
      res.status(404).json({ error: "Book not found for update." });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error:
          "Conflict: A document with that unique field value already exists.",
      });
    }
    handleServerError(res, error);
  }
};

// [DELETE] /books/:id - Delete an book by ID
const deleteBooks = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!validateObjectId(bookId, res)) return;

    const response = await mongodb
      .getDb()
      .db()
      .collection("Books")
      .deleteOne({ _id: new ObjectId(bookId) });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Book deleted successfully." });
    } else {
      res.status(404).json({ error: "Book not found for deletion." });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = {
  getAllBooks,
  getSingle,
  createBooks,
  updateBooks,
  deleteBooks,
};
