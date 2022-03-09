const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { generalError, notFoundError } = require("../middlewares/errors");
const spotsRouter = require("../routers/spotsRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("uploads"));
app.use(helmet());

app.use("/spots", spotsRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
