const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model("User", UserSchema, "user");

module.exports = User;
