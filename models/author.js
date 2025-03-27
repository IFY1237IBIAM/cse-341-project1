const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Author name is required"]
    },
    books: {
        type: String,
        required: [true, "Book title(s) are required"]
    },
    publishedYear: {
        type: Number,
        required: [true, "Published year is required"],
        min: [0, "Published year must be a valid number"]
    },
    dob: {
        type: Date,
        required: [true, "Date of birth is required"]
    }
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
