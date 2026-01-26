const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking'); 
const passport = require('passport');

// Show Login Page
router.get('/login', (req, res) => {
    res.render('user/login');
});

// Show Register Page
router.get('/register', (req, res) => {
    res.render('user/register');
});

// Process Manual Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            req.session.user = user;
            return res.redirect('/');
        }
        res.render('user/login', { error: 'Invalid email or password' });
    } catch (err) {
        console.error(err);
        res.redirect('/user/login');
    }
});

// Process Manual Register
router.post('/register', async (req, res) => {
    try {
        await User.create(req.body);
        res.redirect('/user/login');
    } catch (err) {
        console.error(err);
        res.redirect('/user/register');
    }
});

// Trigger Google Login
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google Callback 
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/user/login' }),
    (req, res) => {
        // Successful authentication
        req.session.user = req.user;
        res.redirect('/');
    }
);

router.get('/dashboard', async (req, res) => {
    // Check if user is logged in (Session OR Google)
    const currentUser = req.session.user || req.user;
    
    if (!currentUser) {
        return res.redirect('/user/login');
    }

    try {
        // Find bookings for this user
        // We check both User ID and Email for matching bookings
        const bookings = await Booking.find({ 
            $or: [
                { user: currentUser._id },
                { email: currentUser.email }
            ]
        }).sort({ date: 1 }); // Sort by date in ascending order
        res.render('user/dashboard', { user: currentUser, bookings });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.redirect('/');
    }
});

//logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect('/');
    });
});

module.exports = router;