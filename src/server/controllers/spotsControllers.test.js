const fs = require("fs");
const Spot = require("../../db/models/Spot");
const { getSpots, deleteSpot, createSpot } = require("./spotsControllers");

jest.mock("firebase/storage", () => ({
  uploadBytes: async () => {},
  getStorage: () => "testRef",
  getDownloadURL: () => "imageUrl",
  ref: () => {},
}));

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

describe("Given a createSpot controller", () => {
  describe("When it receives a request with data and a file", () => {
    test("Then it should call the response json method with a new spot", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const image = {
        fieldname: "image",
        originalname: "spotImage.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "20tf034d18fY882e662bc2fdf9a72a",
        path: "uploads/20tf034d18fY882e662bc2fdf9a72a",
        size: 7830,
      };
      const req = {
        body: {
          name: "Tempest Freerunning Academy",
          marked: 100,
          description: "Awesome indoor facilities for all types of training.",
          createdBy: "622f701d711b35a7cca16023",
          markedBy: ["622f701d711b35a7cca16023", "622f701d711b35a7cca16024"],
          location: "Los Angeles",
          coordinates: [33.9205125116643, 118.33194890241008],
        },
        file: image,
      };
      const newSpot = {
        id: 123456,
        name: "Tempest Freerunning Academy",
        image: "imageUrl",
      };
      const next = jest.fn();

      Spot.create = jest.fn().mockResolvedValue(newSpot);
      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });
      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, image);
      });

      await createSpot(req, res, next);

      expect(res.json).toHaveBeenCalledWith(newSpot);
    });
  });

  describe("When it receives a request with spot data and an image and the renaming fails", () => {
    test("Then it should call next with an error", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const image = {
        fieldname: "image",
        originalname: "spotImage.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "20tf034d18fY882e662bc2fdf9a72a",
        path: "uploads/20tf034d18fY882e662bc2fdf9a72a",
        size: 7830,
      };
      const req = {
        body: {
          name: "Tempest Freerunning Academy",
          marked: 100,
          description: "Awesome indoor facilities for all types of training.",
          createdBy: "622f701d711b35a7cca16023",
          markedBy: ["622f701d711b35a7cca16023", "622f701d711b35a7cca16024"],
          location: "Los Angeles",
          coordinates: [33.9205125116643, 118.33194890241008],
        },
        file: image,
      };

      const next = jest.fn();
      const error = "Error renaming the file";
      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback(error);
        });

      await createSpot(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a request with spot data and no image", () => {
    test("Then it should call next with an error", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const image = {
        fieldname: "image",
        originalname: "spotImage.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "20tf034d18fY882e662bc2fdf9a72a",
        path: "uploads/20tf034d18fY882e662bc2fdf9a72a",
        size: 7830,
      };
      const req = {
        body: {
          name: "Tempest Freerunning Academy",
          marked: 100,
          description: "Awesome indoor facilities for all types of training.",
          createdBy: "622f701d711b35a7cca16023",
          markedBy: ["622f701d711b35a7cca16023", "622f701d711b35a7cca16024"],
          location: "Los Angeles",
          coordinates: [33.9205125116643, 118.33194890241008],
        },
        file: image,
      };

      const next = jest.fn();
      const error = "Error reading the file";
      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(error, image);
      });

      await createSpot(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a request with invalid spot data", () => {
    test("Then it should call next with an error", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const image = {
        fieldname: "image",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "wrong",
      };
      const req = {
        body: {
          name: 1234,
          marked: 100,
          description: "Awesome indoor facilities for all types of training.",
          createdBy: "622f701d711b35a7cca16023",
          markedBy: ["622f701d711b35a7cca16023", "622f701d711b35a7cca16024"],
          location: "Los Angeles",
          coordinates: [33.9205125116643, 118.33194890241008],
        },
        file: image,
      };

      const next = jest.fn();
      const error = new Error("Error, couldn't create the spot");
      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, image);
      });
      jest.spyOn(fs, "unlink").mockImplementation((file, callback) => {
        callback(error);
      });
      Spot.create = jest.fn().mockRejectedValue(null);

      await createSpot(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
