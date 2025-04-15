const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Validate project data
const validateProjectData = (project) => {
    let errors = [];

    if (!project.name || project.name.trim() === "") {
        errors.push("Project name is required.");
    }

    return errors;
};

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const projects = await db.collection("Project").find().toArray();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// Create a new project
const createProject = async (req, res) => {
    try {
        const project = {
            name: req.body.name,
            description: req.body.description,
            createdAt: new Date()
        };

        const errors = validateProjectData(project);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Project").insertOne(project);

        if (result.acknowledged) {
            res.status(201).json({ message: "New project added successfully", projectId: result.insertedId });
        } else {
            res.status(500).json({ error: "Failed to add project." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
// ✅ Update a task (with validation)
const updateProject = async (req, res) => {
    try {
        const ProjectId = req.params.id;
        if (!ObjectId.isValid(ProjectId)) {
            return res.status(400).json({ error: "Invalid project ID." });
        }

        const updatedProject = {
            name: req.body.name,
            description: req.body.description,
            createdAt: req.body.createdAt// Default status to 'pending' if not provided
        };

        // Validate input
        const errors = validateProjectData(updatedProject);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Project").updateOne(
            { _id: new ObjectId(ProjectId) },
            { $set: updatedProject }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Project not found." });
        }

        res.status(200).json({ message: "Project updated successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Delete a task
const deleteProject = async (req, res) => {
    try {
        const ProjectId = req.params.id;
        if (!ObjectId.isValid(ProjectId)) {
            return res.status(400).json({ error: "Invalid project ID." });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Project").deleteOne({ _id: new ObjectId(ProjectId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Project not found." });
        }

        res.status(200).json({ message: "Project deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
// Export
module.exports = { getAllProjects, createProject, updateProject, deleteProject };
