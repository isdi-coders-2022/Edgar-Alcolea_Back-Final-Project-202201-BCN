const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const {
  getSpots,
  deleteSpot,
  createSpot,
  updateSpot,
  getSpot,
} = require("../controllers/spotsControllers");
const auth = require("../middlewares/auth");
const spotValidator = require("../middlewares/spotValidator");

const upload = multer({
  dest: "uploads",
  limits: {
    fileSize: 8000000,
  },
});

const spotsRouter = express.Router();

spotsRouter.get("/", getSpots);
spotsRouter.get("/:id", getSpot);
spotsRouter.delete("/delete/:spotId", auth, deleteSpot);
spotsRouter.post(
  "/new",
  auth,
  validate(spotValidator),
  upload.single("image"),
  createSpot
);
spotsRouter.put(
  "/:id",
  auth,
  validate(spotValidator),
  upload.single("image"),
  updateSpot
);

module.exports = spotsRouter;
