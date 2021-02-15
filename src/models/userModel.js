const mongoose = require('mongoose');
const { isEmail } = require('validator');
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
        required: [true, 'Please enter an email'],
        trim: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },

    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },

    isAdmin:{
        type:  Boolean,
        default: false,
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
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.createdAt;
    delete userObject.updatedAt;
    delete userObject.__v;
   
    return userObject;
}


userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

    user.tokens = user.tokens.concat({ token });
    await user.save()

    return token
}

// Hash the plain text password before saving
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('incorrect email');
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        throw new Error('incorrect password');
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


const User = new mongoose.model('User', userSchema);

module.exports = User;