const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller.js");

// Routes
router.get("/users", userController.getAllUsers);
router.get("/users/:uuid", userController.getUserByUuid);
router.put("/users/:uuid", userController.updateUserByUuid);
router.delete("/users/:uuid", userController.deleteUserByUuid);
router.get("/users/role/:roleId", userController.getUsersByRole);
router.post("/users", userController.createUser);

module.exports = router;