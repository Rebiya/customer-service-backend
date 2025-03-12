const signup = async (req, res) => {
  try {
    const userData = req.body;
    console.log("📩 signup request received:", userData);

    // Fetch user details directly in the controller for debugging
    const user = await signupService.signup(userData);
    console.log("🔄 User Response from signupService:", user);

    if (user.status === "fail") {
      return res.status(403).json({ message: user.message, status: "fail" });
    }

    // On success, send the tokens along with user details
    return res.status(200).json({
      message: "signup successful",
      status: "success",
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      user: user.user,
    });
  } catch (error) {
    console.error("❌ signup error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during signup." });
  }
};

module.exports = { signup };
