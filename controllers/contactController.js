const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private

const getContacts = asyncHandler(async (req, res) => {
    const contact = await Contact.find({user_id: req.user.id}); // Fetch all contacts
    if (!contact || contact.length === 0) {
        res.status(404);
        throw new Error("No contacts found");
    }
    res.status(200).json(contact);
});

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
const createContact = asyncHandler (async (req, res, next) => {
    try {
        console.log("The request body is:", req.body);
        const { name, email, phone } = req.body;

        // Validate input fields
        if (!name || !email || !phone) {
            res.status(400);
            throw new Error("All fields are required");
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            user_id: req.user.id
        })

        // If valid, respond with success message
        res.status(201).json(contact);
    } catch (error) {
        next(error); // Pass error to the error-handling middleware
    }
});

// @desc    Get a single contact by ID
// @route   GET /api/contacts/:id
// @access  Private
const getContactById = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id); // Fetch the contact by ID

        if (!contact) {
            res.status(404);
            throw new Error(`Contact with ID ${id} not found`);
        }

        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
});

// @desc    Update a contact by ID
// @route   PUT /api/contacts/:id
// @access  Private

const updateContact = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params; // Get the contact ID from the route
        const { name, email, phone } = req.body; // Extract the updated fields

        // Check if the contact exists
        const contact = await Contact.findById(id);
        if (!contact) {
            res.status(404);
            throw new Error(`Contact with ID ${id} not found`);
        }

        if(contact.user_id.toString() != req.user.id){
            res.status(403);
            throw new Error("User do not have permission to update other user contacts.");
        }

        // Update the contact details
        contact.name = name || contact.name;
        contact.email = email || contact.email;
        contact.phone = phone || contact.phone;

        const updatedContact = await contact.save(); // Save the updated contact

        res.status(200).json({
            message: `Updated contact with ID: ${id}`,
            data: updatedContact,
        });
    } catch (error) {
        next(error);
    }
});


// @desc    Delete a contact by ID
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params; // Get the contact ID from the route

        // Check if the contact exists
        const contact = await Contact.findById(id);
        if (!contact) {
            res.status(404);
            throw new Error(`Contact with ID ${id} not found`);
        }

        if(contact.user_id.toString() != req.user.id){
            res.status(403);
            throw new Error("User do not have permission to delete other user contacts.");
        }

        // Delete the contact
        await Contact.deleteOne({ _id: req.params.id });

        res.status(200).json({
            message: `Deleted contact with ID: ${id}`,
            data: contact,
        });
    } catch (error) {
        next(error);
    }
});


module.exports = {
    getContacts,
    createContact,
    getContactById,
    updateContact,
    deleteContact,
};

