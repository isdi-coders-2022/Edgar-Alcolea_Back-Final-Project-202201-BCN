const Spot = require("../../db/models/Spot");

const getSpots = async (req, res, next) => {
  try {
    const spots = await Spot.find();
    res.json(spots);
  } catch (error) {
    next(error);
  }
};

const deleteSpot = async (req, res, next) => {
  const spotId = req.params;
  try {
    const deletedSpot = await Spot.findByIdAndDelete(spotId);
    res.json(deletedSpot);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSpots, deleteSpot };
