const userController = require("../controllers/user.controllers");
const { authenticate } = require("../config/jwt.config");

module.exports = app => {
  app.post("/api/register", userController.register); // user is not logged in at this point, by definition, so we don't authenticate this one
  app.post("/api/login", userController.login); // ditto
  app.post("/api/logout", userController.logout); // technically they should be authenticated, but at the end of the day, they're just gonna have their JWT revoked, so whatevs

  // this route now has to be authenticated
  app.get("/api/users", authenticate, userController.getAll); // users MUST be logged in to get list of users, so we add the "authenticate" middleware
  app.get("/api/users/loggedin", authenticate, userController.getLoggedInUser);
};  