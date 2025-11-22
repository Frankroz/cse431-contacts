const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const handleServerError = (res, error) => {
  console.error(error);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: error.message });
};

const validateObjectId = (id, res) => {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({
      error: "Invalid ID format. Must be a 24-character hexadecimal string.",
    });
    return false;
  }
  return true;
};

// [GET] /authors/ - Get all authors
const getAllAuthors = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection("Authors")
      .find()
      .toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

// [GET] /authors/:id - Get a single author by ID
const getSingleAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    if (!validateObjectId(authorId, res)) return;

    const result = await mongodb
      .getDb()
      .db()
      .collection("Authors")
      .findOne({ _id: new ObjectId(authorId) });

    if (!result) {
      return res.status(404).json({ error: "Author not found." });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

// [POST] /authors/ - Create a new author
const createAuthor = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is missing." });
    }

    const author = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      email: req.body.email,
      createdAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("Authors")
      .insertOne(author);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ error: "Failed to create author." });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Conflict: Email already exists." });
    }
    handleServerError(res, error);
  }
};

// [PUT] /authors/:id - Update an existing author by ID
const updateAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    if (!validateObjectId(authorId, res)) return;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is missing." });
    }

    const updatedData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      email: req.body.email,
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("Authors")
      .updateOne({ _id: new ObjectId(authorId) }, { $set: updatedData });

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else if (response.matchedCount === 0) {
      res.status(404).json({ error: "Author not found for update." });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Conflict: Email already exists." });
    }
    handleServerError(res, error);
  }
};

// [DELETE] /authors/:id - Delete an author by ID
const deleteAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    if (!validateObjectId(authorId, res)) return;

    const response = await mongodb
      .getDb()
      .db()
      .collection("Authors")
      .deleteOne({ _id: new ObjectId(authorId) });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Author deleted successfully." });
    } else {
      res.status(404).json({ error: "Author not found for deletion." });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = {
  getAllAuthors,
  getSingleAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
