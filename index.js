const express = require("express");
var morgan = require("morgan");

const app = express();
const port = 3000;

app.use(morgan("combined"));
app.use(express.static("public"));

app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + "/style.css");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/scripts/fetch-api.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(__dirname + "/scripts/fetch-api.js");
});
