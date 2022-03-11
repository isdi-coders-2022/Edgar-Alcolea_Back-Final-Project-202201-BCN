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
  const { spotId } = req.params;
  try {
    const deletedSpot = await Spot.findByIdAndDelete(spotId);
    if (deletedSpot) {
      res.json({ id: deletedSpot.id });
    } else {
      const error = new Error("Spot not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

module.exports = { getSpots, deleteSpot };
