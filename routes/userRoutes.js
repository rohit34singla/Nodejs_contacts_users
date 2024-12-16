const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/userController");
const ValidateToken = require("../middleware/validateTokenHandler");
// const { protect } = require("../middleware/authMiddleware"); // Assuming you have an auth middleware
const router = express.Router();

router.post('/register', registerUser);
router.post("/login", loginUser);

// Protected route, requires authentication middleware
router.get("/current", ValidateToken, currentUser);

module.exports = router;
