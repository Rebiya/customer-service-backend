const db = require("../../Config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      user_email: user.user_email,
      user_first_name: user.user_first_name,
      user_last_name: user.user_last_name,
      user_phone_number: user.user_phone_number,
      user_img: user.user_img,
      active_user_status: user.active_user_status,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      user_email: user.user_email,
      user_first_name: user.user_first_name,
      user_last_name: user.user_last_name,
      user_phone_number: user.user_phone_number,
      user_img: user.user_img,
      active_user_status: user.active_user_status,
      role_id: user.role_id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "1d" }
  );
};

const signup = async (userData) => {
  console.log("📩 Signup Request Received:", userData);

  try {
    const {
      user_email,
      user_pass,
      user_first_name,
      user_last_name,
      user_phone_number,
      role_id,
    } = userData;

    // Check if the user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE user_email = ?",
      [user_email]
    );
    if (existingUser.length > 0) {
      return { status: "fail", message: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user_pass, 10);

    // Insert new user into the database
    const [result] = await db.query(
      "INSERT INTO users (user_email, user_pass, user_first_name, user_last_name, user_phone_number, role_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user_email,
        hashedPassword,
        user_first_name,
        user_last_name,
        user_phone_number,
        role_id,
      ]
    );

    // Fetch newly created user
    const [newUser] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      result.insertId,
    ]);
    if (!newUser.length) {
      return { status: "fail", message: "User registration failed" };
    }

    const user = newUser[0];

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      status: "success",
      message: "Signup successful",
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("❌ Error during signup:", error);
    return { status: "fail", message: "An error occurred during signup." };
  }
};

module.exports = { signup, generateAccessToken, generateRefreshToken };
