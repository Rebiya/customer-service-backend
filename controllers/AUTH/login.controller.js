const loginService = require("../../services/AUTH/login.service.js");
const userService = require("../../services/user.service.js");

const login = async (req, res) => {
  try {
    const userData = req.body;
    console.log("Login request received:", userData);

    // Fetch user details
    const user = await userService.getUserByEmail(userData.user_email);

    if (!user || user.length === 0) {
      return res
        .status(403)
        .json({ message: "User not found", status: "fail" });
    }

    // Call login service
    const result = await loginService.login(userData);
    console.log("Login result:", result);

    if (result.status === "fail") {
      return res.status(403).json({ message: result.message, status: "fail" });
    }

    return res.status(200).json({
      message: "Login successful",
      status: "success",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user, // Return user details
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during login." });
  }
};

module.exports = { login };
