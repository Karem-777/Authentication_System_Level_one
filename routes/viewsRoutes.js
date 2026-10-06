const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/welcome', userController.protect, (req, res) => {
    res.render('welcome', { user: req.user });
});

module.exports = router;