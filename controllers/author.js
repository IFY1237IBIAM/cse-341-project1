const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Helper function for validation
const validateAuthorData = (author) => {
    let errors = [];

    if (!author.name || author.name.trim() === "") {
        errors.push("Author name is required.");
    }

    if (!author.books || author.books.trim() === "") {
        errors.push("Book title(s) are required.");
    }

    if (!author.publishedYear || isNaN(author.publishedYear)) {
        errors.push("Published year must be a valid number.");
    }

    if (!author.dob || isNaN(Date.parse(author.dob))) {
        errors.push("Date of birth must be a valid date.");
    }

    return errors;
};

// ✅ Get all authors
const getAllAuthor = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const authors = await db.collection("Author").find().toArray();
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Create a new author (with validation)
const createAuthor = async (req, res) => {
    try {
        const author = {
            name: req.body.name,
            books: req.body.books,
            completion: req.body.completion,
            publishedYear: req.body.publishedYear,
            dob: req.body.dob
        };

        // Validate input
        const errors = validateAuthorData(author);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Author").insertOne(author);

        if (result.acknowledged) {
            res.status(201).json({ message: "New author added successfully", authorId: result.insertedId });
        } else {
            res.status(500).json({ error: "Failed to add author." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Update an author (with validation)
const updateAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;
        if (!ObjectId.isValid(authorId)) {
            return res.status(400).json({ error: "Invalid author ID." });
        }

        const updatedAuthor = {
            name: req.body.name,
            books: req.body.books,
            completion: req.body.completion,
            publishedYear: req.body.publishedYear,
            dob: req.body.dob
        };

        // Validate input
        const errors = validateAuthorData(updatedAuthor);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Author").updateOne(
            { _id: new ObjectId(authorId) },
            { $set: updatedAuthor }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Author not found." });
        }

        res.status(200).json({ message: "Author updated successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Delete an author
const deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;
        if (!ObjectId.isValid(authorId)) {
            return res.status(400).json({ error: "Invalid author ID." });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Author").deleteOne({ _id: new ObjectId(authorId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Author not found." });
        }

        res.status(200).json({ message: "Author deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Export functions
module.exports = { getAllAuthor, createAuthor, updateAuthor, deleteAuthor };
