const signupService = require("../../services/AUTH/signup.service.js");

const signup = async (req, res) => {
  try {
    const userData = req.body;
    console.log("📩 Signup request received:", userData);

    // Call the signup service
    const user = await signupService.signup(userData);
    console.log("🔄 User Response from signupService:", user);

    if (user.status === "fail") {
      return res.status(400).json({ message: user.message, status: "fail" });
    }

    // Return success response with tokens
    return res.status(201).json({
      message: "Signup successful",
      status: "success",
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      user: user.user, // Ensure the user data is returned
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return res.status(500).json({
      message: "Internal server error during signup.",
      status: "error",
    });
  }
};

module.exports = { signup };
