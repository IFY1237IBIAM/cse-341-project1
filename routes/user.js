const express = require("express");
const { body } = require("express-validator");
const router = express.Router(); // ✅ cleaner and correct
const userController = require("../controllers/user");
const { isAuthenticated } = require("../middleware/authenticate");

// ✅ Validation middleware
const validateUser = [
    body("name").notEmpty().withMessage("Name is required"),
    body("books").notEmpty().withMessage("Books is required"),
    body("publishedYear").isInt().withMessage("Published year must be a number"),
];

// ✅ Define routes
router.get("/", userController.getAllUsers);
router.post("/", isAuthenticated, validateUser, userController.createUser);
router.put("/:id", isAuthenticated, validateUser, userController.updateUser);
router.delete("/:id", isAuthenticated, userController.deleteUser);

module.exports = router;
