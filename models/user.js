const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'pleass tell us your name']
    },
    email:{
        type: String,
        required: [true, 'pleass provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'pleass provide a valid email']
    },
    password:{
        type: String,
        required: [true, 'pleass provide a password'],
        minlength: 8,
        select: false
    },
    googleId:{
        type: String,
        unique: true,
        sparse: true
    },
    avater:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    passwordConfirm: {
        type: String,
        required: [true, 'pleass confirm your password'],
        validate:{
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: {
    type: Date
    }
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save',function(next){
    if(!this.isModified('password')||this.isNew) return next();
    this.passwordChangedAt = Date.now()-1000;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
};

const User = mongoose.model('User',userSchema);

module.exports = User;