const notFoundError = require("./errors");

describe("Given a notFoundError middleware", () => {
  describe("When it receives a response", () => {
    test("Then it should call the response status with 404", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const statusCode = 404;

      notFoundError(null, res);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
  });

  describe("When it receives a response", () => {
    test("Then it should call the response json with an error", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = {
        error: true,
        message: "Resource not found",
      };

      notFoundError(null, res);

      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
