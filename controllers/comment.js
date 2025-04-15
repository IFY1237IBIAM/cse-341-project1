const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Validate comment data
const validateCommentData = (comment) => {
    let errors = [];

    if (!comment.taskId || !ObjectId.isValid(comment.taskId)) {
        errors.push("Valid taskId is required.");
    }

    if (!comment.text || comment.text.trim() === "") {
        errors.push("Comment text is required.");
    }

    return errors;
};

// Get all comments for a specific task
// ✅ Get all tasks
const getAllComments = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const comments = await db.collection("Comment").find().toArray();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
// Create a new comment
const createComment = async (req, res) => {
    try {
        const comment = {
            taskId: req.body.taskId,
            author: req.body.author || "Anonymous",
            text: req.body.text,
            createdAt: req.body.createdAt
        };

        const errors = validateCommentData(comment);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Comment").insertOne({
            ...comment,
            taskId: new ObjectId(comment.taskId)
        });

        if (result.acknowledged) {
            res.status(201).json({ message: "Comment added successfully", commentId: result.insertedId });
        } else {
            res.status(500).json({ error: "Failed to add comment." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
// ✅ Update a task (with validation)
const updateComment = async (req, res) => {
    try {
        const CommentId = req.params.id;
        if (!ObjectId.isValid(CommentId)) {
            return res.status(400).json({ error: "Invalid comment ID." });
        }

        const updatedComment = {
            taskId: req.body.taskId,
            author: req.body.author || "Anonymous",
            text: req.body.text,
            createdAt: req.body.createdAt
        };

        // Validate input
        const errors = validateCommentData(updatedComment);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Comment").updateOne(
            { _id: new ObjectId(CommentId) },
            { $set: updatedComment }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Comment not found." });
        }

        res.status(200).json({ message: "Comment updated successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

// ✅ Delete a task
const deleteComment = async (req, res) => {
    try {
        const CommentId = req.params.id;
        if (!ObjectId.isValid(CommentId)) {
            return res.status(400).json({ error: "Invalid comment ID." });
        }

        const db = mongodb.getDatabase();
        const result = await db.collection("Comment").deleteOne({ _id: new ObjectId(CommentId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "comment not found." });
        }

        res.status(200).json({ message: "comment deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
// Export
module.exports = { getAllComments, createComment, updateComment, deleteComment };
