const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller.js");

// Routes
router.get("/users", authMiddleware([2,3]), userController.getAllUsers);
router.get("/users/:id", authMiddleware([3]), userController.getUserById); 
router.put("/users/:id", authMiddleware([1,3]), userController.updateUser);
router.delete("/users/:id", authMiddleware([3]), userController.deleteUser);
router.post("/users", userController.createUser);

module.exports = router;
