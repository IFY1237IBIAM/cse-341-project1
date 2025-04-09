const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Helper function for validation
const validateUserData = (user) => {
    let errors = [];

    if (!user.name || user.name.trim() === "") {
        errors.push("User name is required.");
    }

    if (!user.email || user.email.trim() === "") {
        errors.push("Email is required.");
    }

    if (!user.password || user.password.trim() === "") {
        errors.push("Password is required.");
    }

    return errors;
};

// ✅ Get all users
const getAllUsers = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const users = await db.collection("User").find().toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Create a new user (with validation)
const createUser = async (req, res) => {
    try {
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // In a real app, you would hash this password before storing
        };

        // Validate input
        const errors = validateUserData(user);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("User").insertOne(user);

        if (result.acknowledged) {
            res.status(201).json({ message: "New user added successfully", userId: result.insertedId });
        } else {
            res.status(500).json({ error: "Failed to add user." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Update a user (with validation)
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID." });
        }

        const updatedUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // In a real app, hash this password before updating
        };

        // Validate input
        const errors = validateUserData(updatedUser);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("User").updateOne(
            { _id: new ObjectId(userId) },
            { $set: updatedUser }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Delete a user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID." });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("User").deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Export functions
module.exports = { getAllUsers, createUser, updateUser, deleteUser };
