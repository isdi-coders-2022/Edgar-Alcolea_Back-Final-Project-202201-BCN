const express = require("express");
const { getSpots } = require("../controllers/spotsControllers");

const router = express.Router();

router.get("/", getSpots);

module.exports = router;
