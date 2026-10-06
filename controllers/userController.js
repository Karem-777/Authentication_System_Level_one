const e = require('express');
const User = require('../models/user');
const JWT = require('jsonwebtoken')
const { promisify } = require('util');

const signToken = id => {
    return JWT.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES
    });
};

const createSendToken = (user,statusCode,res)=>{
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if(process.env.NODE_ENV==='production') cookieOptions.secure = true;

    res.cookie('JWT',token,cookieOptions);
    // remove password from the output
    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data:{
            user
        }
    });
};

exports.signup = async (req,res) => {
    try{
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })
    createSendToken(newUser,201, res);
    }catch(error){
        next(error);
    }
}

exports.login = async (req,res,next) => {
    try{
    const {email,password} = req.body;
    if(!email||!password){
        const error = new Error('please provide email and password');
        error.statusCode = 400;
        return next(error);
    }
    const user = await User.findOne({email}).select('+password');
    if(!user||!(await user.correctPassword(password,user.password))){
        const error = new Error('Incorrect email or password');
        error.statusCode = 401;
        return next(error);
    }
    createSendToken(user,200, res);
    }catch(error){
        next(error);
    }
};

exports.logout = (req,res) => {
    res.cookie('JWT','loggedout',{
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        status:'success',
        message: 'Logged out successfully'
    })
}

exports.protect = async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }else if (req.cookies && req.cookies.JWT) {
    token = req.cookies.JWT;
    }
    if(!token){
        const error = new Error('You are not logged in! please log in to get access.')
        error.statusCode = 401;
        return next(error)
    }

    const decode = await promisify(JWT.verify)(token,process.env.JWT_SECRET);

    const currentUser = await User.findById(decode.id)
    if(!currentUser){
        const error = new Error('The user belonging to this token dose to longer exist.')
        error.statusCode = 401;
        return next(error)
    }

    if(currentUser.changedPasswordAfter(decode.iat)){
        const error = new Error('User recently changed password! Please log in again.')
        error.statusCode = 401;
        return next(error)
    }
    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
}