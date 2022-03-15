const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const fs = require("fs");
const path = require("path");
const debug = require("debug")("PK-spots:server:controllers");
const Spot = require("../../db/models/Spot");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "pk-spots-68866.firebaseapp.com",
  projectId: "pk-spots-68866",
  storageBucket: "gs://pk-spots-68866.appspot.com",
  messagingSenderId: "74314595657",
  appId: "1:74314595657:web:4cd3d9088f5f4d1ab7ee98",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const storageRef = ref(storage);
const spotsRef = ref(storageRef, "spots-images");

const getSpots = async (req, res, next) => {
  try {
    const spots = await Spot.find();
    res.json(spots);
  } catch (error) {
    next(error);
  }
};

const deleteSpot = async (req, res, next) => {
  const { spotId } = req.params;
  try {
    const deletedSpot = await Spot.findByIdAndDelete(spotId);
    if (deletedSpot) {
      res.json({ id: deletedSpot.id });
    } else {
      const error = new Error("Spot not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const createSpot = async (req, res, next) =>
  new Promise((resolve) => {
    try {
      const oldFileName = path.join("uploads", req.file.filename);
      const newFileName = path.join("uploads", req.file.originalname);
      fs.rename(oldFileName, newFileName, (error) => {
        if (error) {
          next(error);
          resolve();
        }
      });
      fs.readFile(newFileName, async (error, file) => {
        if (error) {
          next(error);
          resolve();
        } else {
          uploadBytes(spotsRef, file);
          debug("Uploaded spot image to cloud storage!");
          const firebaseFileUrl = await getDownloadURL(spotsRef);
          const createdSpot = await Spot.create({
            ...req.body,
            image: firebaseFileUrl,
          });
          res.status(201).json(createdSpot);
          resolve();
        }
      });
    } catch (error) {
      fs.unlink(path.join("uploads", req.file.filename), () => {
        error.code = 404;
        error.message = "Error, local file not found";
        next(error);
        resolve();
      });
      error.message = "Error, couldn't create the spot";
      error.code = 400;
      next(error);
      resolve();
    }
  });

module.exports = { getSpots, deleteSpot, createSpot };
