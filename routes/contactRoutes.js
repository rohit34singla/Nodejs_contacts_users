const express = require("express");
const router = express.Router();
const {
    getContacts,
    createContact,
    getContactById,
    updateContact,
    deleteContact,
} = require("../controllers/contactController");

const ValidateToken = require("../middleware/validateTokenHandler");

// Apply ValidateToken middleware to all routes for authentication
router.use(ValidateToken); // This applies to all the routes below

// @desc    Get all contacts and Create a new contact
// @route   GET, POST /api/contacts
router
    .route("/")
    .get(getContacts)
    .post(createContact);

// @desc    Get, Update, Delete a contact by ID
// @route   GET, PUT, DELETE /api/contacts/:id
router
    .route("/:id")
    .get(getContactById)
    .put(updateContact)
    .delete(deleteContact);

module.exports = router;
