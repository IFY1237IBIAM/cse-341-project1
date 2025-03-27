const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllBooks = async (req, res) => {
    try {
        const db = mongodb.getDatabase(); // Correct function call
        const books = await db.collection("Books").find().toArray();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createBook = async (req, res) => {
    try {
        const db = mongodb.getDatabase(); // Get the database instance
        const book = {
            title: req.body.title,
            author: req.body.author,
            publishedYear: req.body.publishedYear,
            genre: req.body.genre
        };

        const result = await db.collection("Books").insertOne(book);

        if (result.acknowledged) {
            res.status(201).json({ message: "Book added successfully", bookId: result.insertedId });
        } else {
            res.status(500).json({ error: "Failed to add book" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).json({ error: "Invalid book ID" });
        }

        const db = mongodb.getDatabase(); // ✅ FIXED
        const updatedBook = {
            title: req.body.title,
            author: req.body.author,
            publishedYear: req.body.publishedYear
        };

        const result = await db.collection("Books").updateOne(
            { _id: new ObjectId(bookId) },
            { $set: updatedBook }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).json({ error: "Invalid book ID" });
        }

        const db = mongodb.getDatabase(); // ✅ FIXED
        const result = await db.collection("Books").deleteOne({ _id: new ObjectId(bookId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export both functions
module.exports = { getAllBooks, createBook, updateBook, deleteBook};