const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const { userLogin, userRegister } = require("../controllers/usersControllers");
const userValidator = require("../middlewares/userValidator");

const upload = multer({
  dest: "uploads",
  limits: {
    fileSize: 8000000,
  },
});

const usersRouter = express.Router();

usersRouter.post("/login", userLogin);
usersRouter.post(
  "/register",
  validate(userValidator),
  upload.single("image"),
  userRegister
);
module.exports = usersRouter;
