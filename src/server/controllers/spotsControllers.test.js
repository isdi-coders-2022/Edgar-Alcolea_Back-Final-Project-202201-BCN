const Spot = require("../../db/models/Spot");
const { getSpots } = require("./spotsControllers");

describe("Given a getSpots controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call the response json method with an array of spots", async () => {
      const spots = [
        {
          name: "Tempest Freerunning Academy",
          marked: 100,
          description:
            "Indoor facility with crazy props and themed spots, training programs and gym.",
          createdBy: "testID",
          location: "Next to L.A.X airport",
          coordinates: [33.920548123347544, -118.33193817357487],
          image: "testImg",
        },
        {
          name: "Test Place",
          marked: 20,
          description: "A place that exists just for the purpose of testing.",
          createdBy: "testID",
          location: "The mind",
          coordinates: [0, 0],
          image: "testImg",
        },
      ];
      const res = {
        json: jest.fn(),
      };
      Spot.find = jest.fn().mockResolvedValue(spots);

      await getSpots(null, res, null);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a next function and it fails to connect the database", () => {
    test("Then it should call next", async () => {
      const error = {
        statusCode: 404,
        message: "No spots found",
      };
      const next = jest.fn();
      Spot.find = jest.fn().mockRejectedValue(error);

      await getSpots(null, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
