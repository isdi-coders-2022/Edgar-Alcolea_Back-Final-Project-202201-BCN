const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const {
  getSpots,
  deleteSpot,
  createSpot,
  updateSpot,
} = require("../controllers/spotsControllers");
const spotValidator = require("../middlewares/spotValidator");

const upload = multer({
  dest: "uploads",
  limits: {
    fileSize: 8000000,
  },
});

const spotsRouter = express.Router();

spotsRouter.get("/", getSpots);
spotsRouter.delete("/delete/:spotId", deleteSpot);
spotsRouter.post(
  "/new",
  validate(spotValidator),
  upload.single("image"),
  createSpot
);
spotsRouter.put(
  "/:id",
  validate(spotValidator),
  upload.single("image"),
  updateSpot
);

module.exports = spotsRouter;
