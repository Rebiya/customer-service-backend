// Import db config
const db = require("../../Config/db.config");
const bcrypt = require("bcrypt");
const userService = require("../user.service.js");
const jwt = require("jsonwebtoken"); // JWT for authentication

const login = async (userData) => {
  try {
    // Fetch user from database by email
    const userExists = await userService.getUserByEmail(userData.user_email);

    // If user doesn't exist
    if (!userExists || userExists.length === 0) {
      return {
        status: "fail",
        message: "User does not exist",
      };
    }

    const user = userExists[0]; // Get the first user from the result

    // Compare password
    const passwordMatch = await bcrypt.compare(
      userData.user_password,
      user.user_pass
    );

    if (!passwordMatch) {
      return {
        status: "fail",
        message: "Incorrect password",
      };
    }

    // Generate JWT token for authentication
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role_id },
      process.env.JWT_SECRET, // Use environment variable for security
      { expiresIn: "2h" }
    );

    return {
      status: "success",
      message: "Login successful",
      token, // Return JWT token
      user: {
        user_id: user.user_id,
        user_email: user.user_email,
        role_id: user.role_id, // Role-based access
      },
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      status: "fail",
      message: "Database operation failed while logging in.",
    };
  }
};

module.exports = { login };
