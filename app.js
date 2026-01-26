require('dotenv').config(); // environment variables
const express = require('express'); // backend
const connectDB = require('./config/db');
const methodOverride = require('method-override'); // put and delete
const session = require('express-session'); // cookies
const expressLayouts = require('express-ejs-layouts'); 
const passport = require('passport'); // authentication
const mongoose = require("mongoose")// Connect to Database
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chillandthrive')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ DB Error:', err));

const app = express();

// Middleware
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //json data from database

// Method Override
app.use(methodOverride('_method'));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Passport Config
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Global Variables (User)
app.use((req, res, next) => {
    res.locals.user = req.session.user || req.user || null;
    next();
});

// Routes
app.use('/', require('./routes/indexRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));