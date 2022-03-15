const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const {
  getSpots,
  deleteSpot,
  createSpot,
} = require("../controllers/spotsControllers");
const spotValidator = require("../middlewares/spotValidator");

const upload = multer({ dest: "uploads" });

const router = express.Router();

router.get("/", getSpots);
router.delete("/delete/:spotId", deleteSpot);
router.post(
  "/new",
  upload.single("image"),

  createSpot
);

module.exports = router;
