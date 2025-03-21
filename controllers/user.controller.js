const userService = require("../services/user.service.js");
const bcrypt = require("bcrypt");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get user by UUID
const getUserByUuid = async (req, res) => {
  try {
    const user = await userService.getUserByUuid(req.params.uuid);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Error fetching user", error });
  }
};

// Create user (password hashing added)
const createUser = async (req, res) => {
  try {
    const { user_pass, ...userData } = req.body;
    if (!user_pass) {
      return res.status(400).json({ message: "Password is required" });
    }
    const hashedPassword = await bcrypt.hash(user_pass, 10);
    const newUser = { ...userData, user_pass: hashedPassword };

    const result = await userService.createUser(newUser);
    return res
      .status(201)
      .json({ message: "User created successfully", user_id: result.insertId });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Error creating user", error });
  }
};

//update user by uuid
const updateUserByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    const updatedData = req.body;

    if (!uuid) {
      return res.status(400).json({ message: "UUID is required" });
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const result = await userService.updateUserByUuid(uuid, updatedData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete user by UUID
const deleteUserByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    const result = await userService.deleteUserByUuid(uuid);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting user", error });
  }
};
const getUsersByRole = async (req, res) => {
  const { roleId } = req.params;

  // Validate roleId
  if (!roleId || isNaN(roleId)) {
    return res.status(400).json({ message: "Invalid role ID" });
  }

  try {
    const users = await userService.getUsersByRole(roleId);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found for this role" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getAllUsers,
  createUser,
  getUserByUuid,
  updateUserByUuid,
  deleteUserByUuid,
  getUsersByRole,
};
