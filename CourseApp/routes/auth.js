const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendMail = require('../middleware/mail');
const keys = require('../keys');

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
                            <p>You have successfully registered by email: ${email}!</p>
                            <hr />
                            <a href="${keys.BASE_URL}">Course Shop</a>
                            `;
            await sendMail(nodemailer, user.email, content);
        }
    } catch (err) {
        console.log(err);
    }
});

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot password?',
        error: req.flash('error'),
    });
});

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Smth unexpected happened, please try again later!');
                return res.redirect('/auth/reset');
            }

            const token = buffer.toString('hex');
            const candidate = await User.findOne({ email: req.body.email });

            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                const content = `<h1>Forgot your password?</h1>
            <p>If no, just ignore this mail</p>
            <p>If yes, follow the link below:</p>
            <a href="${keys.BASE_URL}/auth/password/${token}">Reset password</a>
            <hr />
            <a href="${keys.BASE_URL}">Course Shop</a>
            `;
                await sendMail(nodemailer, candidate.email, content);
                res.redirect('/auth/login');
            } else {
                req.flash('error', 'User with given email doesnt exists!');
                res.redirect('/auth/reset');
            }
        });
    } catch (error) {
        console.error(error);
    }
});

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login');
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() },
        });

        if (!user) {
            return res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                title: 'Set new password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token,
            });
        }
    } catch (error) {
        console.error(error);
    }
});

router.post('/password', async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() },
        });
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login');
        } else {
            req.flash('loginError', 'tokens life time has expired!');
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
