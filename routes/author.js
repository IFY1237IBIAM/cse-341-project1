const express = require("express");
const { body } = require("express-validator"); // ✅ FIXED: Import body
const router = express.Router();
const authorController = require("../controllers/author");

// Validation middleware
const validateAuthor = [
    body("name").notEmpty().withMessage("name is required"),
    body("books").notEmpty().withMessage("books is required"),
    body("publishedYear").isInt().withMessage("Published year must be a number"),
];

// Define routes
router.get("/", authorController.getAllAuthor);
router.post("/", validateAuthor, authorController.createAuthor);
router.put("/:id", validateAuthor, authorController.updateAuthor);
router.delete("/:id", authorController.deleteAuthor);

module.exports = router;