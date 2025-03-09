// Importing dotenv to read environment variables
const dotenv = require('dotenv');
dotenv.config();

// Importing the MongoDB client correctly
const { MongoClient } = require('mongodb');

// Declaring a variable for our database
let database;

// Setting up the initDb function
const initDb = (callback) => {
    if (database) {
        console.log('Db is already initialized');
        return callback(null, database);
    }

    // Ensure that MONGODB_URL is defined
    if (!process.env.MONGODB_URL) {
        return callback(new Error('MONGODB_URL is not defined in .env file'));
    }

    // Correct MongoDB connection setup
    const client = new MongoClient(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    client.connect()
        .then(() => {
            database = client.db(); // Getting the actual database instance
            console.log('Database connection established');
            callback(null, database);
        })
        .catch((err) => {
            console.error('Database connection error:', err);
            callback(err);
        });
};

// Function to get the initialized database
const getDatabase = () => {
    if (!database) {
        throw new Error('Database not initialized');
    }
    return database;
};

// Exporting functions
module.exports = {
    initDb,
    getDatabase
};
