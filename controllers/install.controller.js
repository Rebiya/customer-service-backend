const installService = require("../services/install.service.js");

async function install(req, res) {
  try {
    const installMessage = await installService.install();
    res.status(installMessage.status).json({ message: installMessage.message });
  } catch (error) {
    console.error("❌ Installation error:", error);
    res.status(500).json({ message: "Installation failed" });
  }
}

module.exports = { install };
