//import the user service
const userService = require("../services/user.service.js");

//controller for getting all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users: users });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong on getting users" });
  }
};
//controller for getting a user by id
const getUserById = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await userService.getUserById(user_id);
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong on getting user" });
  }
};
//controller for creating a user
const createUser = async (req, res) => {
  try {
    const user = req.body;
    const result = await userService.createUser(user);
    return res.status(200).json({ message: "user created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong on creating user" });
  }
};
//controller for updating a user
const updateUser = async (req, res) => {
  try {
    const user = req.body;
    const result = await userService.updateUser(user);
    return res.status(200).json({ message: "user updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong on updating user" });
  }
};
//controller for deleting a user
const deleteUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const result = await userService.deleteUser(user_id);
    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong on deleting user" });
  }
};
//controller for getting a user by email
const getUserByEmail = async (req, res) => {
  try {
    const user_email = req.params.email;
    const user = await userService.getUserByEmail(user_email);
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong on getting user" });
  }
};
 
//export the controllers
module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
};
