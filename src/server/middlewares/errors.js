const debug = require("debug")("PK-spots:middlewares:errors");

const notFoundError = (req, res) => {
  res.status(404);
  res.json({ error: true, message: "Resource not found" });
};

// eslint-disable-next-line no-unused-vars
const generalError = (err, req, res, next) => {
  debug(`Error: ${err.message}`);
  const errorCode = err.code ?? 500;
  const errorMessage = err.code ? err.message : "Internal server error";
  res.status(errorCode);
  res.json({ error: true, message: errorMessage });
};

module.exports = { notFoundError, generalError };
