const chalk = require("chalk");
const mongoose = require("mongoose");
const debug = require("debug")("PK-spots:db");

const connectDB = (connectString) =>
  new Promise((resolve, reject) => {
    mongoose.connect(connectString, (error) => {
      if (error) {
        reject(error);
      }
      debug(chalk.blue("Connected to database"));
      resolve();
    });
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        delete ret.__v;
      },
    });
  });

module.exports = connectDB;
