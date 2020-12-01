require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passport = require("./auth");
const User = require("./models/User");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.json());

mongoose.connect(process.env.DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/signup", (req, res) => {
  console.log(req.body);
  res.json(req.body);
  new User({ username: req.body.username, password: req.body.password }).save();
});

app.post(
  "/login",
  passport.authenticate("local", { session: false }),
  function (req, res) {
    const token = jwt.sign({ foo: "bar" }, process.env.JWT_SECRET);
    res.send(token);
  }
);

app.get("/dashboard", (req, res) => {
  res.send("You made it to dashboard!");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/home.html"));
});

app.listen(3000, () =>
  console.log("Server listening on http://localhost:3000")
);
