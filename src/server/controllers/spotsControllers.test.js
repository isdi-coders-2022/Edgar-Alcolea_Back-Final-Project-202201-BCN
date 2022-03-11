const Spot = require("../../db/models/Spot");
const { getSpots, deleteSpot } = require("./spotsControllers");

describe("Given a getSpots controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call the response json method with an array of spots", async () => {
      const spots = [
        {
          id: "1",
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
          id: "2",
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

describe("Given a deleteSpot controller", () => {
  describe("When it receives an id by params and a response", () => {
    test("Then it should call the response json method with the deleted spot", async () => {
      const req = {
        params: { spotId: "2" },
      };
      const res = {
        json: jest.fn(),
      };
      const spot = {
        id: "2",
        name: "Test Place",
        marked: 20,
        description: "A place that exists just for the purpose of testing.",
        createdBy: "testID",
        location: "The mind",
        coordinates: [0, 0],
        image: "testImg",
      };
      const expectedResponse = { id: spot.id };

      Spot.findByIdAndDelete = jest.fn().mockResolvedValue(spot);
      await deleteSpot(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives an unexistant id by params and a response", () => {
    test("Then it should call next with an error with message 'Spot not found' and code 404", async () => {
      const req = {
        params: { spotId: "2" },
      };
      const next = jest.fn();
      const error = new Error("Spot not found");

      Spot.findByIdAndDelete = jest.fn().mockResolvedValue(undefined);
      await deleteSpot(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives an id by params and a response and it fails to connect the database", () => {
    test("Then it should call next with an error with code 400", async () => {
      const req = {
        params: { spotId: "2" },
      };
      const next = jest.fn();
      const error = new Error("Spot not found");

      Spot.findByIdAndDelete = jest.fn().mockRejectedValue(error);
      await deleteSpot(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("code", 400);
    });
  });
});
