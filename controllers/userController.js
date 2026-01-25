const User = require('../models/User');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // 1. Hash the password (ye mota moti hashing)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        // 2. Create User
        const user = await User.create({ name, email, password: hash });

        // 3. Set Session & Redirect
        req.session.user = user; // user ka session declare
        res.redirect('/user/dashboard');

    } catch (e) {
        // --- FIX IS HERE ---
        // Check if error code is 11000 (Duplicate Email)
        if (e.code === 11000) {
            return res.render('user/register', { error: 'Email already exists. Please login.' });
        }
        
        // Handle other random errors
        console.error(e);
        res.render('user/register', { error: 'Something went wrong. Try again.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Compare password (yaha compare kr rahe hai)
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect('/user/dashboard');
        } else {
            res.render('user/login', { error: 'Invalid Email or Password' });
        }
    } catch (e) {
        console.error(e);
        res.render('user/login', { error: 'Login failed. Please try again.' });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/user/login');
        
        // Get user history date wise sort format mai
        const bookings = await Booking.find({ user: req.session.user._id })
                                      .populate('service')
                                      .sort({ date: -1 });

        // Yaha bhej rahe hai display krne ke liye
        res.render('user/dashboard', { user: req.session.user, bookings });
    } catch (e) {
        console.error(e);
        res.redirect('/user/login');
    }
};