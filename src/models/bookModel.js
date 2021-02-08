const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },

    author: {
        type: String,
        required: true,
        lowercase: true,
    },

    price: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
    },

    img: {
        type: Buffer
    }
})

const Book = new mongoose.Model('Book', bookSchema);

module.exports = Book;