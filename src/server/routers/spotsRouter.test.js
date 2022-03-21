require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../../db/connectDB");
const Spot = require("../../db/models/Spot");
const User = require("../../db/models/User");
const app = require("../index");

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
      xCoordinate: "34.5457",
      yCoordinate: "-2748324.324235",
      image: "testImg",
    },
    {
      name: "Test Place",
      marked: 20,
      description: "A place that exists just for the purpose of testing.",
      createdBy: "62274dd6fb4746a872d98b8d",
      location: "The mind inside its creator",
      xCoordinate: "34.5457",
      yCoordinate: "-2748324.324235",
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

describe("Given a /spots/delete/2 endpoint", () => {
  describe("When it receives a DELETE request", () => {
    test("Then it should respond with 200 status code and id: 2", async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxhdWxodXMiLCJpZCI6IjYyMzQ3ZDZjYjVlOGZhMDQxZjdjMWE0NiIsImltYWdlIjoiaHR0cHM6Ly9maXJlYmFzZXN0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vdjAvYi9way1zcG90cy02ODg2Ni5hcHBzcG90LmNvbS9vL3VwbG9hZHMlNUNmb3RvZWQuanBnP2FsdD1tZWRpYSZ0b2tlbj04NzhjMTU2MS1jMWY3LTRmNWEtYTM1NC00OTQ3NTUzZTBkZWYiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjQ3ODU0MjU3fQ.QCmDUyMnZztfuhqn4OxZvpdUzlZUppZrhS6ofgVQrzM";
      const spots = await request(app).get("/spots");
      const { id } = spots.body[0];

      const { body } = await request(app)
        .delete(`/spots/delete/${id}`)
        .set({ Authorization: token })
        .expect(200);

      expect(body).toHaveProperty("id", id);
    });
  });
});

describe("Given a /spots/new endpoint", () => {
  describe("When it receives a POST request", () => {
    test("Then it should respond with 201 status code and the spot created", async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxhdWxodXMiLCJpZCI6IjYyMzQ3ZDZjYjVlOGZhMDQxZjdjMWE0NiIsImltYWdlIjoiaHR0cHM6Ly9maXJlYmFzZXN0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vdjAvYi9way1zcG90cy02ODg2Ni5hcHBzcG90LmNvbS9vL3VwbG9hZHMlNUNmb3RvZWQuanBnP2FsdD1tZWRpYSZ0b2tlbj04NzhjMTU2MS1jMWY3LTRmNWEtYTM1NC00OTQ3NTUzZTBkZWYiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjQ3ODU0MjU3fQ.QCmDUyMnZztfuhqn4OxZvpdUzlZUppZrhS6ofgVQrzM";
      const user = {
        id: "7854f1c",
        name: "Testio Coolio",
        username: "Testman",
        password: "testpass",
        age: 99,
        bio: "A place that exists just for the purpose of testing.",
        city: "Testtown",
        image: "testImg",
        createdSpots: [],
        save: jest.fn(),
      };

      User.findById = jest.fn().mockResolvedValue(user);
      const { body } = await request(app)
        .post(`/spots/new`)
        .field("name", "Tempest Freerunning Academy")
        .field(
          "description",
          "Awesome indoor facilities for all types of training."
        )
        .field("location", "Los Angeles")
        .field("xCoordinate", "33.9205125116643")
        .field("yCoordinate", "118.33194890241008")
        .attach("image", "uploads/Sin título.png")
        .set({ Authorization: token })
        .expect(201);

      expect(body).toHaveProperty("name");
    });
  });
});

describe("Given a /spots/:id endpoint", () => {
  describe("When it receives a PUT request and a spot in the request", () => {
    test("Then it should respond with 200 status code and the updated spot", async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxhdWxodXMiLCJpZCI6IjYyMzQ3ZDZjYjVlOGZhMDQxZjdjMWE0NiIsImltYWdlIjoiaHR0cHM6Ly9maXJlYmFzZXN0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vdjAvYi9way1zcG90cy02ODg2Ni5hcHBzcG90LmNvbS9vL3VwbG9hZHMlNUNmb3RvZWQuanBnP2FsdD1tZWRpYSZ0b2tlbj04NzhjMTU2MS1jMWY3LTRmNWEtYTM1NC00OTQ3NTUzZTBkZWYiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjQ3ODU0MjU3fQ.QCmDUyMnZztfuhqn4OxZvpdUzlZUppZrhS6ofgVQrzM";
      const spots = await request(app).get("/spots");
      const { id } = spots.body[0];
      const expectedName = "Updated Spot";
      const { body } = await request(app)
        .put(`/spots/${id}`)
        .field("name", "Updated Spot")
        .field(
          "description",
          "Awesome indoor facilities for all types of training."
        )
        .field("location", "Los Angeles")
        .field("xCoordinate", "33.9205125116643")
        .field("yCoordinate", "118.33194890241008")
        .attach("image", "uploads/Sin título.png")
        .set({ Authorization: token });

      expect(body).toHaveProperty("name", expectedName);
    });
  });
});
