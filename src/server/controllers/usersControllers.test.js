const User = require("../../db/models/User");
const { getUser } = require("./usersControllers");

describe("Given a getSpot controller", () => {
  describe("When it receives a response and a request containing the id '7854f1c'", () => {
    test("Then it should call the response json method with a spot", async () => {
      const res = {
        json: jest.fn(),
      };
      const req = {
        params: {
          id: "7854f1c",
        },
      };
      const user = {
        id: "7854f1c",
        name: "Testio Coolio",
        username: "Testman",
        password: "testpass",
        age: 99,
        bio: "A place that exists just for the purpose of testing.",
        city: "Testtown",
        image: "testImg",
      };

      User.findById = jest.fn().mockResolvedValue(user);

      await getUser(req, res);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });
});
