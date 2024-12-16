const asyncHandler = require("express-async-handler");
const User = require("../models/userModel"); // User model
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For JWT generation

// @desc    Register a user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists/registered");
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error("Failed to create user");
    }
});

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide both email and password");
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("Invalid user credentials");
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error("Invalid password credentials");
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });

    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
    });
});

// @desc    Get current user details
// @route   GET /api/users/current
// @access  Private
const currentUser = asyncHandler(async (req, res) => {
    const user = req.user; // Assuming middleware populates req.user

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
    });
});

module.exports = { registerUser, loginUser, currentUser };