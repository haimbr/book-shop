const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true, 
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    shoppingCart: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        }
    }],

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

},{
    timestamps: true,
})


userSchema.methods.toJSON = function(){
    const user = this.toObject();
    // Extracts the desired values from the use object
    return (({ email, userName, shoppingCart }) => ({ email, userName, shoppingCart }))(user);
}


userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save()

    return token
}

// Hash the plain text password before saving
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!user){
        throw new Error('Unable to login');
    }
    
    return user;
}


// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = new mongoose.model('User', userSchema);

module.exports = User;