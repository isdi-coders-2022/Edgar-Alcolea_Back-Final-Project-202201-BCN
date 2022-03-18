const bcrypt = require("bcrypt");
const debug = require("debug")("PK-spots:server:controllers");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const User = require("../../db/models/User");
const { storage } = require("./spotsControllers");

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    const error = new Error("User not found");
    error.code = 401;
    next(error);
  } else {
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      const error = new Error(`Invalid password`);
      error.code = 401;
      next(error);
    } else {
      const UserDate = {
        username: user.username,
        id: user.id,
      };
      const token = jwt.sign(UserDate, process.env.JWT_SECRET);
      res.json({ token });
    }
  }
};

const userRegister = async (req, res, next) => {
  try {
    if (req.file) {
      const oldFileName = path.join("uploads", req.file.filename);
      const newFileName = path.join("uploads", req.file.originalname);
      fs.rename(oldFileName, newFileName, (error) => {
        if (error) {
          next(error);
        } else {
          fs.readFile(newFileName, async (err, file) => {
            if (err) {
              next(err);
            } else {
              const spotRef = ref(storage, newFileName);
              await uploadBytes(spotRef, file);
              debug("Uploaded user image to cloud storage!");
              const firebaseFileUrl = await getDownloadURL(spotRef);
              const createdUser = await User.create({
                ...req.body,
                image: firebaseFileUrl,
              });
              res.status(201).json(createdUser);
            }
          });
        }
      });
    } else {
      const createdUser = await User.create(req.body);
      if (createdUser) {
        res.json(createdUser);
      } else {
        const error = new Error("Invalid data format");
        error.code = 400;
        next(error);
      }
    }
  } catch (error) {
    error.code = 500;
    error.message = "Couldn't create user";
    next(error);
  }
};

module.exports = { userLogin, userRegister };
