const express = require("express");
const getSpots = require("../controllers/getSpots");

const router = express.Router();

router.get("/", getSpots);

module.exports = router;
