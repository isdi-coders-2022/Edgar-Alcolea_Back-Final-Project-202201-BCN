const express = require("express");
const { validate } = require("express-validation");
const {
  getSpots,
  deleteSpot,
  createSpot,
} = require("../controllers/spotsControllers");
const spotValidator = require("../middlewares/spotValidator");

const router = express.Router();

router.get("/", getSpots);
router.delete("/delete/:spotId", deleteSpot);
router.post("/new", validate(spotValidator), createSpot);

module.exports = router;
