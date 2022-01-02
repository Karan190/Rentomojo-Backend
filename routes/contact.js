const express = require('express');
const router = express.Router();
const Contact = require('../models/contact.js');

const requireLogin = (req, res, next) => {
    if (!req.session || req.session.userid == undefined) {
        req.flash('error', 'You have to Log in first');
        return res.redirect('/login');
    }
    next();
}

router.get('/', async (req, res) => {
    const arr = await Contact.find({}).limit(10);      //This Will set a limit for only 10 contacts
    res.render('contacts/home', { arr });
})

router.get('/add', requireLogin, (req, res) => {
    //console.log(req.session.userid)
    res.render('contacts/add');
})
router.post('/add', requireLogin, async (req, res) => {
    try {
        const contactObj = new Contact(req.body);
         await contactObj.save();
        req.flash('success', 'Successfully Created..');
        return res.redirect('/');
    } catch (e) {
        req.flash('error', 'Email already Exists');
        res.redirect('/add');
    }
})
router.get('/:id/modify', requireLogin, async (req, res) => {
    //console.log(req.params.id);
    const contactObj = await Contact.findById(req.params.id);
    res.render('contacts/modify', { contactObj });
})
router.put('/:id', requireLogin, async (req, res) => {
    const { id } = req.params;
    await Contact.findByIdAndUpdate(id, req.body);
    req.flash('success', 'Updatedted successfully..');
    res.redirect('/');
})
router.get('/:id/delete', requireLogin, async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    req.flash('success', 'Deleted successfully..');
    res.redirect('/');
})

router.post('/search', requireLogin, async (req, res) => {
   let str=req.body.searchText;
    const arr = await Contact.find({$or:[{ $text:{ $search: str }},{email:str}]}).limit(10);      //This Will set a limit for only 10 contacts
    res.render('contacts/show', { arr });

})
module.exports = router;