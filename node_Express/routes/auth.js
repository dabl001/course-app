const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
    });
});

router.post('/login', async (req, res) => {
    const user = await User.findById('65314d27e7dda2b1a1cee230');
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save((err) => {
        if (err) {
            throw err;
        }
    });
    res.redirect('/');
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    });
});

module.exports = router;
