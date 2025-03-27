require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const app = express();

const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Routes
app.use('/', require('./routes'));
app.use('/books', require('./routes/books')); // Route for Books CRUD operations
app.use('/author', require('./routes/author'));

// Handle 404 - Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Connect to MongoDB and start server
mongodb.initDb((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Stop server if DB fails to connect
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and Node is running on port ${port}`);
    });
  }
});