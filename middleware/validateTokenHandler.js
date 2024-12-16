const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel"); // Assuming you have a user model

// Middleware to protect private routes
const ValidateToken = asyncHandler(async (req, res, next) => {
    let token;

    // Check if token is provided in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from the header
            token = req.headers.authorization.split(" ")[1];

            // Log the token for debugging (optional, remove in production)
            console.log("Token received:", token);

            // Verify token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // Get user from token and add to request object
            req.user = await User.findById(decoded.id).select("-password");

            // Log user info for debugging (optional, remove sensitive data in production)
            console.log("User decoded from token:", req.user);

            next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        console.warn("No token provided in request");
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = ValidateToken;
