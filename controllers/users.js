const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllUsers = (req, res) => {
  const result = mongodb.getDb().db().collection("users").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = (req, res) => {
  const result = mongodb
    .getDb()
    .db()
    .collection("users")
    .find({ _id: new ObjectId(req.params.id) });
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists[0]);
  });
};

module.exports = { getAllUsers, getSingle };
