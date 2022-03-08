const debug = require("debug");

const initServer = (app, port) => {
  const server = app.listen(port, () => {});
};
