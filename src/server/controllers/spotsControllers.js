const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const fs = require("fs/promises");
const path = require("path");
const debug = require("debug")("PK-spots:server:controllers");
const Spot = require("../../db/models/Spot");
const User = require("../../db/models/User");

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

const getSpots = async (req, res, next) => {
  try {
    const spots = await Spot.find().populate("createdBy", "username");

    res.json(spots);
  } catch (error) {
    next(error);
  }
};

const getSpot = async (req, res) => {
  const { id } = req.params;
  const spot = await Spot.findById(id).populate("createdBy", "username");
  res.json(spot);
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

const createSpot = async (req, res, next) => {
  try {
    const oldFileName = path.join("uploads", req.file.filename);
    const newFileName = path.join("uploads", req.file.originalname);
    await fs.rename(oldFileName, newFileName);
    const imageBuffer = await fs.readFile(newFileName);
    const spotRef = ref(storage, newFileName);
    await uploadBytes(spotRef, imageBuffer);
    debug("Uploaded spot image to cloud storage!");
    const firebaseFileUrl = await getDownloadURL(spotRef);
    const createdSpot = await Spot.create({
      ...req.body,
      image: firebaseFileUrl,
    });
    const creator = await User.findById(req.userId);
    creator.createdSpots.push(createdSpot);
    await creator.save();
    res.status(201).json(createdSpot);
  } catch (err) {
    try {
      await fs.unlink(path.join("uploads", req.file.filename));
    } catch (error) {
      next(error);
    }
    err.message = "Error, image not found";
    err.code = 400;
    next(err);
  }
};

const updateSpot = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Spot.findById(id);
    const oldFileName = path.join("uploads", req.file.filename);
    const newFileName = path.join("uploads", req.file.originalname);
    await fs.rename(oldFileName, newFileName);
    const imageBuffer = await fs.readFile(newFileName);
    const spotRef = ref(storage, newFileName);
    await uploadBytes(spotRef, imageBuffer);
    debug("Uploaded spot image to cloud storage!");
    const firebaseFileUrl = await getDownloadURL(spotRef);
    const updatedSpot = await Spot.findByIdAndUpdate(
      id,
      {
        ...req.body,
        image: firebaseFileUrl,
      },
      { new: true }
    );
    res.status(200).json(updatedSpot);
  } catch (err) {
    err.message = "Error, couldn't update the spot";
    err.code = 400;
    next(err);
  }
};

module.exports = {
  getSpots,
  getSpot,
  deleteSpot,
  createSpot,
  updateSpot,
  storage,
};
