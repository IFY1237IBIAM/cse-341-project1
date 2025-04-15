const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const comment = require("../controllers/comment");
const { isAuthenticated } = require("../middleware/authenticate");

// ✅ Validation middleware for projects
const validateProject = [
    body("name").notEmpty().withMessage("name is required"),
    body("description").optional(),
];

// ✅ Define project routes
router.get("/", comment.getAllComments);
router.post("/", isAuthenticated, validateProject, comment.createComment);
router.put("/:id", isAuthenticated, validateProject, comment.updateComment);
router.delete("/:id", isAuthenticated, comment.deleteComment);

module.exports = router;
