const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const project = require("../controllers/project");
const { isAuthenticated } = require("../middleware/authenticate");

// ✅ Validation middleware for projects
const validateProject = [
    body("name").notEmpty().withMessage("name is required"),
    body("description").optional(),
];

// ✅ Define project routes
router.get("/", project.getAllProjects);
router.post("/", isAuthenticated, validateProject, project.createProject);
router.put("/:id", isAuthenticated, validateProject, project.updateProject);
router.delete("/:id", isAuthenticated, project.deleteProject);

module.exports = router;
