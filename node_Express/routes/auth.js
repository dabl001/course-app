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
    try {
        const { email, password } = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) {
            const areSame = password === candidate.password;
            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save((err) => {
                    if (err) {
                        throw err;
                    }
                });
                res.redirect('/');
            } else {
                res.redirect('/auth/login#login');
            }
        } else {
            return res.redirect('/auth/login#login');
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    });
});

router.post('/register', async (req, res) => {
    try {
        const { email, password, repeat, name } = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) {
            res.redirect('/auth/login#register');
        } else {
            const user = new User({
                email,
                name,
                password,
                cart: {
                    items: [],
                },
            });
            await user.save();
            res.redirect('/auth/login#login');
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
