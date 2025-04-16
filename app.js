const express = require("express");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');

const app = express();

app.use(express.json());

// Routes
app.use('/project', projectRoutes); // Make sure this matches your route definition
app.use('/task', taskRoutes);
app.use('/user', userRoutes);
app.use('/comment', commentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

module.exports = app;
