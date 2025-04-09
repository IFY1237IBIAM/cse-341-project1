const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Helper function for validation
const validateTaskData = (task) => {
    let errors = [];

    if (!task.title || task.title.trim() === "") {
        errors.push("Task title is required.");
    }

    if (!task.description || task.description.trim() === "") {
        errors.push("Task description is required.");
    }

    if (!task.dueDate || isNaN(Date.parse(task.dueDate))) {
        errors.push("Due date must be a valid date.");
    }

    return errors;
};

// ✅ Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const tasks = await db.collection("Task").find().toArray();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Create a new task (with validation)
const createTask = async (req, res) => {
    try {
        const task = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate, // Ensure this is a valid date string
            status: req.body.status || 'pending', // Default status to 'pending' if not provided
        };

        // Validate input
        const errors = validateTaskData(task);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Task").insertOne(task);

        if (result.acknowledged) {
            res.status(201).json({ message: "New task added successfully", taskId: result.insertedId });
        } else {
            res.status(500).json({ error: "Failed to add task." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Update a task (with validation)
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        if (!ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: "Invalid task ID." });
        }

        const updatedTask = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            status: req.body.status || 'pending', // Default status to 'pending' if not provided
        };

        // Validate input
        const errors = validateTaskData(updatedTask);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Task").updateOne(
            { _id: new ObjectId(taskId) },
            { $set: updatedTask }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Task not found." });
        }

        res.status(200).json({ message: "Task updated successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Delete a task
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        if (!ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: "Invalid task ID." });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Task").deleteOne({ _id: new ObjectId(taskId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Task not found." });
        }

        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Export functions
module.exports = { getAllTasks, createTask, updateTask, deleteTask };
