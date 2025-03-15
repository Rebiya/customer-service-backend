const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller.js");

// Routes
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.post("/users", userController.createUser);

module.exports = router;
