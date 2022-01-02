const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user.js');

router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 8);
    const userObj = new User({ email, password: hash });
    try {
        await userObj.save();
        req.session.userid = userObj._id;
        req.flash('success', 'Successfully Registerd..');
        res.redirect('/');
    }
    catch (e) {
        console.log(e);
        req.flash('error', 'User already Exists. Please Login');
        res.redirect('/');
    }
})
router.get('/login', (req, res) => {
    res.render('users/login');
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userObj = await User.findOne({ email });
        const temp = await bcrypt.compare(password, userObj.password);
        if (temp) {
            req.flash('success', 'successfully logged in..');
            req.session.userid = userObj._id;
            res.redirect('/');
        }
        else {
            req.flash('error', 'Invalid Credentials.. Try Again..');
            res.redirect('/login');
        }
    } catch (e) {
        req.flash('error', 'Register yourself first..');
        res.redirect('/register');
    }
})
router.get('/logout', (req, res) => {
    
    req.flash('success','Successfully Logged out..');
    req.session.userid=null;
    res.redirect('/');
})

module.exports = router;