const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
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
  },
  city: {
    type: String,
  },
  image: {
    type: String,
  },
  createdSpots: {
    type: [Schema.Types.ObjectId],
    ref: "Spot",
    default: [],
  },
});

const User = model("User", userSchema, "users");

module.exports = User;
