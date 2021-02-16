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

// *********** test ****************
router.get('/test', async (req, res) => {
    try {
        // const book = await Book.findById('6029491f98296c35a484c7a8');
        const book = await Book.find({}).limit(20);
        img = `data:image/png;base64,${book.img.toString('base64')}`;
        res.render('book', {
            img: img,
            name: book.name,
            author: book.author,
        }) 
    } catch (e) {
        res.status(404).send()
    }
})



router.get('/add-new-book', (req, res) => res.render('add-book'));
module.exports = router;