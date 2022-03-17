const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const {
  getSpots,
  deleteSpot,
  createSpot,
  getSpot,
} = require("../controllers/spotsControllers");
const spotValidator = require("../middlewares/spotValidator");

const upload = multer({
  dest: "uploads",
  limits: {
    fileSize: 8000000,
  },
});

const router = express.Router();

router.get("/", getSpots);
router.get("/:id", getSpot);
router.delete("/delete/:spotId", deleteSpot);
router.post(
  "/new",
  validate(spotValidator),
  upload.single("image"),
  createSpot
);

module.exports = router;
