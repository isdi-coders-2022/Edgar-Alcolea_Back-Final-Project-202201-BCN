require("dotenv").config();
const debug = require("debug")("PK-spots:root");
const chalk = require("chalk");
const express = require("express");
const connectDB = require("./db/connectDB");
const initServer = require("./server/initServer");

const app = express();
const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_CONNECT;

(async () => {
  try {
    await initServer(app, port);
    await connectDB(mongoUri);
    debug(chalk.bgGray.greenBright(`Connection succesful!`));
  } catch (error) {
    debug(chalk.redBright(`Error: ${error.message}`));
  }
})();
