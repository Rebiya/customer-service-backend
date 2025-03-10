const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller.js");

// Routes
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById); // Fixed param syntax
router.put("/users/:id", authMiddleware([3]), userController.updateUser);
router.delete("/users/:id", authMiddleware([3]), userController.deleteUser);
router.post("/users", userController.createUser);

module.exports = router;
