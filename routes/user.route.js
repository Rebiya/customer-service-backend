//import the express module
const express = require("express");
//call the router method from the express to create router
const router = express.Router();
//import the login controller
const userController = require("../controllers/user.controller.js");
//create a route to handle the login request on post
router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser);
router.get("/users/{id}", userController.getUserById);
router.put("/users/{id}", userController.updateUser);
router.delete("/users/{id}", userController.deleteUser);
router.get("/users", userController.getUserByEmail);
//export the router
module.exports = router;