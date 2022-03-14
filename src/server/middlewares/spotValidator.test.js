const { Joi } = require("express-validation");
const spotValidator = require("./spotValidator");

describe("Given an spotValidator schema", () => {
  describe("When it's used to validate a valid spot", () => {
    test("Then it should return undefined", () => {
      const spot = {
        name: "Test Place",
        marked: 10,
        description: "A place that doesn't really exist.",
        createdBy: "Lauhus",
        markedBy: ["Laulhus", "Joey"],
        location: "Barcelona, nope",
        coordinates: [33.4125, -45.0326],
        image: "thisIsAnUrl",
      };

      const validation = Joi.assert(spot, spotValidator);

      expect(validation).toBe(undefined);
    });
  });

  describe("When it's used to validate a spot with wrong name", () => {
    test("Then it should throw an error", () => {
      const spot = {
        name: 1234,
        marked: 10,
        description: "A place that doesn't really exist.",
        createdBy: "Lauhus",
        markedBy: ["Laulhus", "Joey"],
        location: "Barcelona, nope",
        coordinates: [33.4125, -45.0326],
        image: "thisIsAnUrl",
      };

      expect(() => Joi.assert(spot, spotValidator)).toThrow();
    });
  });
});
