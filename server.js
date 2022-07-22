"use strict";
const express = require("express");
const app = express();
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/contact", function (req, res) {
  res.send("Contact");
});

app.post("/bmicalculator", function (req, res) {
  res.sendFile(__dirname + "/oop.html");
});

app.listen(3000, function () {
  console.log("The server is running");
});
