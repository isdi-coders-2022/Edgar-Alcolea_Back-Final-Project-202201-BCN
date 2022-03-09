const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const connectDB = require("../../db/connectDB");
const Spot = require("../../db/models/Spot");

require("dotenv").config();

let mongoDB;

beforeAll(async () => {
  mongoDB = await MongoMemoryServer.create();
  const connectUri = mongoDB.getUri();
  await connectDB(connectUri);
});

beforeEach(async () => {
  await Spot.create(
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
    }
  );
});

afterEach(async () => {
  await Spot.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoDB.stop();
});

describe("Given a /spots endpoint", () => {
  describe("When it receives a GET request", () => {
    test("Then it should respond with 200 status code and an array of Spots");
  });
});
