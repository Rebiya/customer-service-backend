const logoutService = require("../../services/AUTH/logout.service.js");

const logout = async (req, res) => {
  try {
    const userData = req.body;
    console.log("📩 logout request received:", userData);

    // Fetch user details directly in the controller for debugging
    const user = await logoutService.logout(userData);
    console.log("🔄 User Response from logoutService:", user);

    if (user.status === "fail") {
      return res.status(403).json({ message: user.message, status: "fail" });
    }

    return res.status(200).json({
      message: "logout successful",
      status: "success",
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      user: user.user,
    });
  } catch (error) {
    console.error("❌ logout error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during logout." });
  }
};

module.exports = { logout };
