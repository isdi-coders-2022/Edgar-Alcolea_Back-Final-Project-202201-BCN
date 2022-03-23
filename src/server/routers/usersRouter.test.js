require("dotenv").config();
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
    password: "$2b$10$sBwzgvsUJiK/RU5zVVY8qOV257N/xtWepDi6R/MBxzUIp23QDrfy.",
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

  describe("When it receives a request without image", () => {
    test("Then it should respond with status code 201 and the created user", async () => {
      const { body } = await request(app)
        .post("/users/register")
        .field("username", "TestKing")
        .field("name", "Tester")
        .field("password", "testpass")
        .field("age", "19")
        .field("bio", "I exist to test")
        .field("city", "testtown")
        .expect(200);

      expect(body).toHaveProperty("name");
    });
  });

  describe("When it receives a request with an used username", () => {
    test("Then it should respond with status code 400 and an error", async () => {
      const error = new Error("This username already exists");
      const { body } = await request(app)
        .post("/users/register")
        .field("username", "Testman")
        .field("name", "Tester")
        .field("password", "testpass")
        .field("age", "19")
        .field("bio", "I exist to test")
        .field("city", "testtown")
        .expect(400);

      expect(body).toHaveProperty("message", error.message);
    });
  });

  describe("When it receives a request with invalid data", () => {
    test("Then it should respond with status code 201 and the created user", async () => {
      const error = new Error("Couldn't create user");
      const { body } = await request(app)
        .post("/users/register")
        .field("name", "Tester")
        .field("password", "testpass")
        .field("age", "19")
        .field("bio", "I exist to test")
        .field("city", "testtown")
        .expect(500);

      expect(body).toHaveProperty("message", error.message);
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

describe("Given a /users/login endpoint", () => {
  describe("When it receives a request with valid username and password", () => {
    test("Then it shouls respond with a token", async () => {
      const user = {
        username: "Testman",
        password: "testpass",
      };
      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(201);

      expect(body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with wrong password", () => {
    test("Then it shouls respond with status 400 and an error", async () => {
      const error = new Error(`Invalid password`);
      const user = {
        username: "Testman",
        password: "testpassada",
      };
      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(401);

      expect(body).toHaveProperty("message", error.message);
    });
  });

  describe("When it receives a request with wrong username", () => {
    test("Then it shouls respond with status 400 and an error", async () => {
      const error = new Error("User not found");
      User.findOne = jest.fn().mockResolvedValue(undefined);
      const user = {
        username: "Testmanaso",
        password: "testpass",
      };
      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(401);

      expect(body).toHaveProperty("message", error.message);
    });
  });
});
