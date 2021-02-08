const express = require('express');
const User = require('../models/userModel');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');

const router = new express.Router();

router.post('/users/signUp', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        if(err.code === 11000 ){
            return res.status(409).send() 
        }
        res.status(400).send();
    }
})


module.exports = router;