const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../../db/connectDB");
const User = require("../../db/models/User");
const app = require("../index");

let mongoDB;

beforeAll(async () => {
  mongoDB = await MongoMemoryServer.create();
  const connectUri = mongoDB.getUri();
  await connectDB(connectUri);
});

beforeEach(async () => {
  await User.create({
    _id: "623713460e6ef3e645cbccf5",
    username: "Testman",
    password: "testpass",
    age: "99",
    bio: "Indoor facility with crazy props and themed spots, training programs and gym.",
    city: "testcity",
    image: "testImg",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoDB.stop();
});

describe("Given a /users/register endpoint", () => {
  describe("When it receives a request with a valid user", () => {
    test("Then it should respond with status code 201 and the created user", async () => {
      const { body } = await request(app)
        .post("/users/register")
        .field("username", "TestKing")
        .field("name", "Tester")
        .field("password", "testpass")
        .field("age", "19")
        .field("bio", "I exist to test")
        .field("city", "testtown")
        .attach("image", "uploads/Sin título.png")
        .expect(201);

      expect(body).toHaveProperty("name");
    });
  });
});

describe("Given a /users/623713460e6ef3e645cbccf5 endpoint", () => {
  describe("When it receives a request with params: 623713460e6ef3e645cbccf5", () => {
    test("Then it should call response json method with the user with id 123", async () => {
      const { body } = await request(app)
        .get("/users/623713460e6ef3e645cbccf5")
        .expect(200);

      expect(body).toHaveProperty("username");
    });
  });
});
