require("dotenv").config();
const express = require("express");
const healthRoutes = require("./src/routes/healthRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

// Basic API information
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to PaddySetu Backend 🚜"
    });
});

module.exports = app;