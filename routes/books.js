const express = require("express");
const { body } = require("express-validator"); // ✅ FIXED: Import body
const router = express.Router();
const booksController = require("../controllers/books");

// Validation middleware
const validateBook = [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("publishedYear").isInt().withMessage("Published year must be a number"),
];

// Define routes
router.get("/", booksController.getAllBooks);
router.post("/", validateBook, booksController.createBook);
router.put("/:id", validateBook, booksController.updateBook);
router.delete("/:id", booksController.deleteBook);

module.exports = router;
