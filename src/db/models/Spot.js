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
    minlength: 20,
    maxlength: 300,
  },
  createdBy: { type: Schema.Types.ObjectId },
  location: {
    type: String,
    minlength: 10,
    maxlength: 100,
  },
  coordinates: {
    type: [Schema.Types.Decimal128],
  },
  image: {
    type: String,
    required: true,
  },
});

const Spot = model("Spot", spotSchema, "spots");

module.exports = Spot;
