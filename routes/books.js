const express = require("express");
const { body } = require("express-validator");
const router = express.Router(); // ✅ cleaner and correct
const authorController = require("../controllers/author");
const { isAuthenticated } = require("../middleware/authenticate");

// ✅ Validation middleware
const validateAuthor = [
    body("name").notEmpty().withMessage("Name is required"),
    body("books").notEmpty().withMessage("Books is required"),
    body("publishedYear").isInt().withMessage("Published year must be a number"),
];

// ✅ Define routes
router.get("/", authorController.getAllAuthor);
router.post("/", isAuthenticated, validateAuthor, authorController.createAuthor);
router.put("/:id", isAuthenticated, validateAuthor, authorController.updateAuthor);
router.delete("/:id", isAuthenticated, authorController.deleteAuthor);

module.exports = router;
