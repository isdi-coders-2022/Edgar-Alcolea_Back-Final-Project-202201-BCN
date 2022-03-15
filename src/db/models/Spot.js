const { Schema, model } = require("mongoose");

const spotSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  marked: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  markedBy: { type: [Schema.Types.ObjectId], ref: "User" },
  location: {
    type: String,
  },
  xCoordinate: {
    type: String,
    required: true,
  },
  yCoordinate: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Spot = model("Spot", spotSchema, "spots");

module.exports = Spot;
