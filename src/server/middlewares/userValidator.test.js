const { Joi } = require("express-validation");
const userValidator = require("./userValidator");

describe("Given an userValidator schema", () => {
  describe("When it's used to validate a valid user", () => {
    test("Then it should return undefined", () => {
      const testUser = {
        userName: "testMan",
        password: "testPass",
        name: "Test",
        age: 29,
        bio: "I was born fot he solely purpose of being tested.",
        city: "Testcity",
        image: "thisIsAUrl",
      };

      const validation = Joi.assert(testUser, userValidator);

      expect(validation).toBe(undefined);
    });
  });

  describe("When it's used to validate a user with wrong name", () => {
    test("Then it should throw an error", () => {
      const testUser = {
        userName: 123,
        password: "testPass",
        name: "Test",
        age: 29,
        bio: "I was born fot he solely purpose of being tested.",
        city: "Testcity",
        image: "thisIsAUrl",
      };

      expect(() => Joi.assert(testUser, userValidator)).toThrow();
    });
  });
});
