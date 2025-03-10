const userService = require("../user.service.js");
const db = require("../../Config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate Access Token
const generateAccessToken = (user) => {
  const payload = {
    user_id: user.user_id,
    user_first_name: user.user_first_name,
    user_last_name: user.user_last_name,
    user_email: user.user_email,
    user_phone_number: user.user_phone_number,
    user_role: user.role_id,
    user_img: user.user_img,
    active_user_status: user.active_user_status,
    user_added_date: user.user_added_date,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ user_id: user.user_id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1d",
  });
};

const login = async (userData) => {
  console.log("User attempting login:", userData.user_email);

  try {
    // Normalize email
    const userEmail = userData.user_email.trim().toLowerCase();

    // Fetch user from database
    const users = await userService.getUserByEmail(userEmail);

    if (!users || users.length === 0) {
      return { status: "fail", message: "User does not exist" };
    }

    const user = users[0]; // Extract first user object

    if (!user || !user.user_pass) {
      console.error("Error: User record is missing 'user_pass'");
      return { status: "fail", message: "Invalid user data." };
    }

    // Check password match
    const passwordMatch = await bcrypt.compare(
      userData.user_pass,
      user.user_pass
    );

    if (!passwordMatch) {
      return { status: "fail", message: "Incorrect password" };
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refreshToken in DB
    await db.query(`UPDATE users SET refresh_token = ? WHERE user_id = ?`, [
      refreshToken,
      user.user_id,
    ]);

    return {
      status: "success",
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        user_id: user.user_id,
        user_first_name: user.user_first_name,
        user_last_name: user.user_last_name,
        user_email: user.user_email,
        user_phone_number: user.user_phone_number,
        user_role: user.role_id,
        user_img: user.user_img,
        active_user_status: user.active_user_status,
      },
    };
  } catch (error) {
    console.error("Error during login:", error);
    return { status: "fail", message: "An error occurred during login." };
  }
};

module.exports = { login, generateAccessToken, generateRefreshToken };
