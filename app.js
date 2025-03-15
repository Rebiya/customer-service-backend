// Import required modules
const express = require("express");
require("dotenv").config();
const query = require("./Config/db.config");
const cors = require("cors");
const expressSanitizer = require("express-sanitizer"); // Fixed sanitization issue
const cookieParser = require("cookie-parser");
// Create an Express application
const app = express();
app.use(cookieParser());
// CORS configuration to handle cross-origin requests
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allows cookies and auth headers
  optionsSuccessStatus: 200,
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(expressSanitizer()); // Fix: Correct sanitizer middleware

// Import and use routes
const router = require("./routes");
app.use("/api", router);

// Set port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export for testing
module.exports = app;
