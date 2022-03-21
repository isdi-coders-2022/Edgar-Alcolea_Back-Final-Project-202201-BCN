const User = require("../../db/models/User");
const { getUser } = require("./usersControllers");

const mockUserPopulate = jest.spyOn(User, "populate");

describe("Given a getSpot controller", () => {
  describe("When it receives a response and a request containing the id '7854f1c'", () => {
    test("Then it should call the response json method with a spot", async () => {
      const res = {
        json: jest.fn(),
      };
      const req = {
        params: {
          id: "6235f7a6029d09413cc89581",
        },
      };
      const user = {
        id: "6235f7a6029d09413cc89581",
        name: "Testio Coolio",
        username: "Testman",
        password: "testpass",
        age: 99,
        bio: "A place that exists just for the purpose of testing.",
        city: "Testtown",
        image: "testImg",
      };
      User.findById = jest.fn().mockReturnThis();
      mockUserPopulate.mockImplementation(() => Promise.resolve(user));

      await getUser(req, res);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });
});
