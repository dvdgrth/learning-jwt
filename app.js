require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passport = require("./auth");
const User = require("./models/User");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sendNewToken = function (req, res, next) {
  const token = jwt.sign(
    { sub: req.user._id, name: req.user.username },
    process.env.JWT_SECRET,
    { expiresIn: 10 }
  );
  res.send(token);
};

const setRefreshToken = function (req, res, next) {
  const refreshToken = jwt.sign(
    { sub: req.user._id, name: req.user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "100d" }
  );
  req.user.refreshToken = res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/refresh",
  });
  next();
};

app.post("/signup", (req, res) => {
  new User({ username: req.body.username, password: req.body.password }).save();
  res.json(req.body);
});

app.post(
  "/login",
  passport.authenticate("local", { session: false }),
  setRefreshToken,
  sendNewToken
);

app.get(
  "/refresh",
  passport.authenticate("refreshTokenStrategy", { session: false }),
  sendNewToken
);

app.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(`${req.user.username}, you made it to dashboard!`);
  }
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/home.html"));
});

app.listen(3000, () =>
  console.log("Server listening on http://localhost:3000")
);
