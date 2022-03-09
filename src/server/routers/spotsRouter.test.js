const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../../db/connectDB");
const Spot = require("../../db/models/Spot");
const app = require("../index");
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
      createdBy: "62274dd6fb4746a872d98b8d",
      location: "Next to L.A.X airport",
      coordinates: [33.920548123347544, -118.33193817357487],
      image: "testImg",
    },
    {
      name: "Test Place",
      marked: 20,
      description: "A place that exists just for the purpose of testing.",
      createdBy: "62274dd6fb4746a872d98b8d",
      location: "The mind inside its creator",
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
    test("Then it should respond with 200 status code and an array of Spots", async () => {
      const expectedLength = 2;
      const expectedName = "Tempest Freerunning Academy";

      const { body } = await request(app).get("/spots").expect(200);

      expect(body).toHaveLength(expectedLength);
      expect(body[0]).toHaveProperty("name", expectedName);
    });
  });
});
