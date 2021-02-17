const express = require('express');
const Book = require('../models/bookModel.js');
const multer = require('multer');
const sharp = require('sharp');

const router = new express.Router();


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})


router.post('/add-book', upload.single('img'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.body.img = buffer;
    const book = new Book(req.body);
    try {
        await book.save();
        res.send(book)
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})


router.get('/get-books', async (req, res) => {
    const category = req.category;
    try{
        const books = await Book.find({ categories: category}).limit(20);
        books.forEach(book => book.img = `data:image/png;base64,${book.img.toString('base64')}`);
    }catch(err){
        res.status(400).send({message: err.message});
    }
    
})


router.get('/add-new-book', (req, res) => res.render('add-book'));
module.exports = router;