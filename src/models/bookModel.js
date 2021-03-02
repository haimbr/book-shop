const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    author: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },

    price: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
        required: true,
        lowercase: true,
    }, 

    img: {
        type: Buffer
    },

    categories: [String]
    
},{
    timestamps: true
})

const Book = new mongoose.model('Book', bookSchema);

module.exports = Book;