const User = require('../models/user');
const JWT = require('jsonwebtoken')



exports.signup = async (req,res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })
}

exports.login = async (req,res,next) => {
    const {email,password} = req.body;
    let error;
    if(!email||!password){
        error = new Error('please provide email and password');
        error.statusCode = 400;
        return next(error);
    }
    const user = await User.findOne({email}).select('+password');
    if(!user||!(await user.correctPassword(password,user.password))){
        error = new Error('Incorrect email or password');
        error.statusCode = 401;
        return next(error);
    }
}