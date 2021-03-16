const express = require('express');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const { auth, checkUser } = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');

const router = new express.Router();


const handleErrors = (err) => {
    let errors = { email: '', password: '' };
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }
    return errors;
}

router.post('/users/signUp', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 })
        res.status(201).send({ user, token });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    }
})



router.post('/users/login', async (req, res) => {
    const user = new User(req.body);

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
        res.send({ user, token });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.cookie('jwt', '', { maxAge: 1 });
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.post('/users/update-shoppingCart', checkUser, async (req, res) => {
    try {
        const book = await Book.findOne({ $or: [{ name: req.query.book, author: req.query.author }, { _id: req.query._id }] });

        if (!book) {
            throw new Error('Book not found')
        }

        if (!res.locals.user) {
            return res.send(book._id);
        }
        updateShoppingCart(req, res, book, req.query.method);


        await res.locals.user.save();
        res.send(res.locals.user.shoppingCart);
    } catch (e) {
        res.status(404).send("err");
    }
})


function updateShoppingCart(req, res, book, method) {
    if (method === "removeAll") {
        res.locals.user.shoppingCart = res.locals.user.shoppingCart.filter(item => item._id.toString() != book._id.toString());
    } else if (method === "remove") {
        const index = res.locals.user.shoppingCart.findIndex(item => item._id.toString() === book._id.toString());
        if (index >= 0) res.locals.user.shoppingCart.splice(index, 1);
    } else if (method === "add") {
        res.locals.user.shoppingCart.push(book);
    }
}



module.exports = router;