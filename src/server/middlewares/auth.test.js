const { JsonWebTokenError } = require("jsonwebtoken");
const auth = require("./auth");

require("dotenv").config();

describe("Given an auth middleware", () => {
  describe("When it gets a request, a response and a valid token", () => {
    test("Then it should call the response next method", async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxhdWxodXMiLCJpZCI6IjYyMzQ3ZDZjYjVlOGZhMDQxZjdjMWE0NiIsImltYWdlIjoiaHR0cHM6Ly9maXJlYmFzZXN0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vdjAvYi9way1zcG90cy02ODg2Ni5hcHBzcG90LmNvbS9vL3VwbG9hZHMlNUNmb3RvZWQuanBnP2FsdD1tZWRpYSZ0b2tlbj04NzhjMTU2MS1jMWY3LTRmNWEtYTM1NC00OTQ3NTUzZTBkZWYiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjQ3ODU0MjU3fQ.QCmDUyMnZztfuhqn4OxZvpdUzlZUppZrhS6ofgVQrzM";
      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
      };
      const next = jest.fn();

      await auth(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it gets a request, a response and an invalid token", () => {
    test("Then it should call the response next method with an error", async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3RtYW4iLCJpZCI6IjYyMTdiZmVkZTc1M2MwYjg3YjFmYzY4YiIsImlhdCI6MTY0NTcyMzg5NH0.dLFj4iJ0Kf5merQK6vofOn4tgY-88NsKp9ABICv5HhU";
      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
      };
      const next = jest.fn();
      const error = new JsonWebTokenError("invalid signature");

      await auth(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it gets a request, a response without token", () => {
    test("Then it should call the response next method with an error", async () => {
      const req = {
        header: jest.fn().mockReturnValue(""),
      };
      const next = jest.fn();
      const error = new Error("Token missing");

      await auth(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
