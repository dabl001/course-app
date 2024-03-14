const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendMail = require('../middleware/mail');

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError'),
    });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);
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
                req.flash('loginError', 'Incorrect password!');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'User doesnt exist!');
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
        const { email, password, name } = req.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            req.flash('registerError', 'User with this email already exists!');
            res.redirect('/auth/login#register');
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email,
                name,
                password: hashPassword,
                cart: {
                    items: [],
                },
            });
            await user.save();
            res.redirect('/auth/login#login');
            const content = `<h1>Welcome to our Course Shop</h1>
                            <p>You have successfully registered by email: ${email}!</p>`;
            sendMail(nodemailer, user.email, content);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
