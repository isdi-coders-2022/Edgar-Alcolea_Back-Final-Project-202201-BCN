const express = require("express");

const router = express.Router();

router.get("/", getSpots);

module.exports = router;
