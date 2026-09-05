const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "PaddySetu Backend is running 🚜"
    });
});

module.exports = app;