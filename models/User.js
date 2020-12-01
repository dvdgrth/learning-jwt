const mongoose = require("mongoose");
const passport = require("passport");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

UserSchema.methods.validPassword = function (password) {
  console.log(password, this.password);
  return password === this.password;
};

const User = mongoose.model("User", UserSchema);

// const newUser = new User({ username: "david", password: "password" });
// newUser.save();

module.exports = User;
