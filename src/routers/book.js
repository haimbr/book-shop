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
    fileFilter(req, file, cb) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})


router.post('/add-book', checkUser, upload.single('img'), async (req, res) => {
    if (!res.locals.user || !res.locals.user.isAdmin) return res.send('You have to log in as an admin');
    const buffer = await sharp(req.file.buffer).png().toBuffer();
    req.body.img = buffer;
    const book = new Book(req.body);
    try {
        await book.save();
        book.img = `data:image/png;base64,${book.img.toString('base64')}`;
        res.render('index', { books: [book] })
    } catch (err) {
        res.status(400).send('something went wrong');
    }
})


router.patch('/edit-book', checkUser, async (req, res) => {
    if (!res.locals.user || !res.locals.user.isAdmin) return res.send('You have to log in as an admin');
    try {
        const book = await Book.findOne({ name: req.body.bookName, author: req.body.bookAuthor });
        for (let update in req.body.bookDetails) {
            book[update] = req.body.bookDetails[update];
        }
        await book.save();
        res.send()
    } catch (err) {
        res.status(400).send('something went wrong');
    }
})


router.delete('/delete-book', checkUser, async (req, res) => {
    if (!res.locals.user || !res.locals.user.isAdmin) return res.send('You have to log in as an admin');
    try {
        const book = await Book.findOneAndDelete({ name: req.body.bookName, author: req.body.bookAuthor });
        if (!book) return res.status(404).send();
        res.send()
    } catch (err) {
        res.status(400).send('something went wrong');
    }
})


router.get('/get-books', async (req, res) => {
    let searchParameter;
    if (req.query.category) {
        searchParameter = { categories: req.query.category };
    } else {
        searchParameter = { $or: [{ name: new RegExp(req.query.search, "g") }, { author: new RegExp(req.query.search, "g") }] }
    }
    getBooks(req, res, searchParameter)
})



async function getBooks(req, res, searchParameter) {
    const maxBooksInPage = 2;
    const skip = req.query.requestedPage - 1 || 0;
    try {
        const count = await Book.countDocuments(searchParameter);
        const books = await Book.find(searchParameter).skip(maxBooksInPage * skip).limit(maxBooksInPage);
        books.forEach(book => book.img = `data:image/png;base64,${book.img.toString('base64')}`);
        const pagination = createPagination(skip + 1, Math.ceil((count / maxBooksInPage)));
        res.render('index', { books, category: req.query.category || "תוצאות חיפוש", pagination })
    } catch (err) {
        res.status(400).send('something went wrong');
    }
}



router.get('/shopping-cart', async (req, res) => {
    try {
        const result = await Book.find({ '_id': { $in: res.locals.shoppingCart } });
        let books = sortObject(result);
        let totalPrice = 0;
        books.forEach(book => {
            book.quantity = res.locals.shoppingCart.filter(id => id == book._id).length;
            totalPrice += book.price * book.quantity;
        });
        res.render('shopping-cart', { books, totalPrice })

    } catch (err) {
        res.status(400).send('something went wrong');
    }
})


router.get('/book-details', async (req, res) => {
    try {
        const book = await Book.findOne({ name: req.query.book, author: req.query.author });
        book.img = `data:image/png;base64,${book.img.toString('base64')}`
        res.render('book-details', { book })
    } catch (e) {
        res.status(400).send('something went wrong');
    }
});



router.get('/', async (req, res) => {
    req.query.category = "הנמכרים ביותר"
    getBooks(req, res, {})
})


function createPagination(currentPage, pagesSize) {
    const pagination = { pagesList: [] };

    pagination.previous = currentPage !== 1 ? true : false;
    pagination.next = currentPage !== pagesSize ? true : false;
    pagination.first = currentPage > 3 ? 1 : null;
    pagination.last = pagesSize - currentPage > 2 ? pagesSize : null;

    const firstPage = Math.max(1, (pagesSize - (currentPage - 2) >= 4 ? currentPage - 2 : pagesSize - 4))

    for (let i = firstPage; i < firstPage + 5 && i <= pagesSize; i++) {
        pagination.pagesList[pagination.pagesList.length] = (i !== currentPage ? { pageNumber: i } : { currentPage });
    }
    return pagination;
}


function sortObject(obj) {
    let books = []
    obj.forEach(book => {
        books.push({
            img: `data:image/png;base64,${book.img.toString('base64')}`,
            name: book.name,
            author: book.author,
            price: book.price,
            _id: book._id,
            description: book.description
        })
    });
    return books;
}

router.get('/add-new-book', (req, res) => res.render('add-book'));
module.exports = router;