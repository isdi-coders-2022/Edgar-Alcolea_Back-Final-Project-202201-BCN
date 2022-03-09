const Spot = require("../../db/models/Spot");

const getSpots = async (req, res, next) => {
  try {
    const spots = await Spot.find();
    res.json(spots);
  } catch (error) {
    next(error);
  }
};

module.exports = getSpots;
