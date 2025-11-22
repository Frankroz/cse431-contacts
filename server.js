const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const app = express();
const env = require("dotenv").config();

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

app.use("/", require("./routes/index.js"));

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database listening - app listening on ${host}:${port}`);
    });
  }
});
