const express = require('express');
const Book = require('../models/bookModel.js');
const multer = require('multer');
const sharp = require('sharp');
const { auth, checkUser } = require('../middleware/auth');

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
    const category = req.query.category;
    const page = req.query.page || 0;
    try{
        const count = await Book.countDocuments({categories: category});
        const books = await Book.find({categories: category}).skip(page).limit(20);      
        books.forEach(book => book.img = `data:image/png;base64,${book.img.toString('base64')}`);
        const paginationNav = createPagesNavigation(page+1, Math.ceil((count/20)))
        res.render('index', { books, category, paginationNav })
    }catch(err){
        res.status(400).send({message: err.message});
    }  
})
 

router.post('/search-books', async (req, res) => {
    try{
        const books = await Book.find({ $or: [{ name: req.query.category }, { author: req.body.author }] });
        books.forEach(book => book.img = `data:image/png;base64,${book.img.toString('base64')}`);
        res.send(books)
    }catch(err){
        res.status(400).send({message: err.message});
    }   
})



router.get('/create-shopping-cart', async (req, res) => {
    // if(!res.locals.shoppingCart){
    //     console.log('no shoppingCart in req.cookies')
    //     return res.render('shopping-cart')
    // }    

    try{
        const result = await Book.find({ '_id': { $in: res.locals.shoppingCart } });      
        let books = sortObject(result);
        books.forEach(book =>{
            book.quantity =  res.locals.shoppingCart.filter(id => id == book._id).length;           
        });
        res.render('shopping-cart', { books })

    }catch(err){
        res.status(400).send({message: err.message});
    }   
})




function createPagesNavigation(currentPage, pages){
    const nav = {
        currentPage,
        previous: false,
        next: false,
        first: null,
        last: null,
        pages: []
    };

    if(currentPage !== 1){
        nav.previous = true;
    }
    if (currentPage !== pages){
        nav.next = true;
    }
    if(currentPage > 2){
        nav.first = 1;
    }
    if (pages - currentPage > 1){
        nav.last = pages;
    }

    let firstPage = Math.max(1, currentPage-2);
    for(let i = firstPage; i < firstPage + 5 && i<pages; i++){
        nav.pages.push(i);
    }

    return nav;
}


function sortObject(obj){
    let books = []
    obj.forEach(book =>{
        books.push({
            img: `data:image/png;base64,${book.img.toString('base64')}`,
            name: book.name,
            author: book.author,
            price: book.price,
            _id: book._id,
        })
    } );
    return books;
}

router.get('/add-new-book', (req, res) => res.render('add-book'));
module.exports = router;