const express = require("express");
const { body } = require("express-validator");
const router = express.Router(); // ✅ cleaner and correct
const taskController = require("../controllers/task");
const { isAuthenticated } = require("../middleware/authenticate");

// ✅ Validation middleware
const validateTask = [
    body("title").notEmpty().withMessage("title is required"),
    body("discription").notEmpty().withMessage("discription is required"),
    body("dueDate").isInt().withMessage("dueDate year must be a number"),
];

// ✅ Define routes
router.get("/", taskController.getAllTasks);
router.post("/", isAuthenticated, validateTask, taskController.createTask);
router.put("/:id", isAuthenticated, validateTask, taskController.updateTask);
router.delete("/:id", isAuthenticated, taskController.deleteTask);

module.exports = router;
