const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const { constants } = require("./constants");
const connectDb = require("./config/dbConnection");

connectDb();

const app = express();

const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// API Routes
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Handle undefined routes
app.use((req, res, next) => {
    res.status(constants.NOT_FOUND);
    next(new Error("Route not found"));
});

// Error-handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
