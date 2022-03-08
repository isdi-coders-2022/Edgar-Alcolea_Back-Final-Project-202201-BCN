const { generalError, notFoundError } = require("./errors");

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

describe("Given a generalError middleware", () => {
  describe("When it receives a response and an error", () => {
    test("Then it should call the response status method with the error code and the json method with the error message", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const err = {
        code: 403,
        message: "Bad request",
      };
      const expectedError = { error: true, message: err.message };

      generalError(err, null, res, null);

      expect(res.status).toHaveBeenCalledWith(err.code);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a response and no error", () => {
    test("Then it should call the response status method with 500 and the json method with 'Inernal server error'", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const code = 500;
      const err = {
        message: "Hola",
      };
      const expectedError = {
        error: true,
        message: "Internal server error",
      };

      generalError(err, null, res, null);

      expect(res.status).toHaveBeenCalledWith(code);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});
