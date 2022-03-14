const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  bio: {
    type: String,
    minlength: 20,
    maxlength: 300,
  },
  city: {
    type: String,
  },

  image: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema, "users");

module.exports = User;
