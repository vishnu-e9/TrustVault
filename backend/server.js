
require("dotenv").config();

const authenticate = require("./middleware/authenticate");
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const documentRoutes = require("./routes/documents");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(express.json({ limit: "100kb" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

// Get logged-in user details
app.get("/api/auth/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication successful",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TrustVault backend is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database name:", mongoose.connection.name);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`TrustVault server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

// Start the server only when this file is run directly.
// When imported by automated tests, the server will not start automatically.
if (require.main === module) {
  startServer();
}

// Export the Express app for automated tests
module.exports = app;
