const express = require("express");
const { getSpots, deleteSpot } = require("../controllers/spotsControllers");

const router = express.Router();

router.get("/", getSpots);
router.delete("/delete/:spotId", deleteSpot);

module.exports = router;
