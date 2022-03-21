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
      const UserData = {
        username: user.username,
        id: user.id,
        image: user.image,
        admin: user.admin,
      };
      const token = jwt.sign(UserData, process.env.JWT_SECRET);
      res.json({ token });
    }
  }
};

const userRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const usedUserName = await User.findOne({ username });
    if (!usedUserName) {
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
                const encryptedPassword = await bcrypt.hash(password, 10);
                const createdUser = await User.create({
                  ...req.body,
                  password: encryptedPassword,
                  image: firebaseFileUrl,
                });
                res.status(201).json(createdUser);
              }
            });
          }
        });
      } else {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
          ...req.body,
          password: encryptedPassword,
        });
        if (createdUser) {
          res.json(createdUser);
        } else {
          const error = new Error("Invalid data format");
          error.code = 400;
          next(error);
        }
      }
    } else {
      const error = new Error("This username already exists");
      error.code = 400;
      next(error);
      return;
    }
  } catch (error) {
    error.code = 500;
    error.message = "Couldn't create user";
    next(error);
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("createdSpots");
  res.json(user);
};

module.exports = { userLogin, userRegister, getUser };
