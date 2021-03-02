const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}
  


const checkUser = async (req, res, next) => {
    res.locals.user = null;
    if(req.cookies.shoppingCart){ 
        res.locals.shoppingCart = JSON.parse(req.cookies.shoppingCart);
    }

    const token = req.cookies.jwt;
    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (user) {
            res.locals.user = user;
            res.locals.shoppingCart = user.shoppingCart.map(id => id._id.toString());
        } 
    }
    next(); 
};

module.exports = {auth, checkUser}