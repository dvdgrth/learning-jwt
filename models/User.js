const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  revoked: { type: Boolean, default: false },
});

UserSchema.methods.validPassword = function (password) {
  return password === this.password;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
