const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const path = require('path');

// --- MULTER CONFIGURATION (For Image Uploads) ---
const storage = multer.diskStorage({
    destination: './public/uploads/', // Files will be saved here
    filename: function(req, file, cb){
        // Save as: timestamp-filename.jpg
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Check file type (Optional but good)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
});

// --- AUTH MIDDLEWARE ---
const auth = (req, res, next) => {
    if (req.session.admin) {
        return next();
    }
    res.redirect('/admin/login');
};

// --- ROUTES ---

// Login & Logout
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Dashboard
router.get('/', auth, adminController.getDashboard);

// Services
router.post('/service', auth, adminController.createService);
router.post('/service/update/:id', auth, adminController.updateService);
router.get('/service/delete/:id', auth, adminController.deleteService);

// Bookings
router.post('/booking/update/:id', auth, adminController.updateBookingStatus);

// Blog Management (UPDATED WITH UPLOAD MIDDLEWARE)
// We add 'upload.single("image")' here to handle the file
router.post('/blog/add', auth, upload.single('image'), adminController.createContent);

router.get('/content/edit/:id', auth, adminController.getEditContent);
router.post('/content/edit/:id', auth, adminController.updateContent);
router.get('/content/delete/:id', auth, adminController.deleteContent);

// Feedback
router.post('/feedback/approve/:id', auth, adminController.approveTestimonial);
router.post('/service', auth, adminController.createService);
router.post('/service/update/:id', auth, adminController.updateService);
// NEW: Delete Service Route
router.get('/service/delete/:id', auth, adminController.deleteService);

// FEEDBACK
router.post('/feedback/approve/:id', auth, adminController.approveTestimonial);
// NEW: Reply Route
router.post('/feedback/reply/:id', auth, adminController.replyToFeedback);
router.post('/schedule/update', auth, adminController.updateSchedule);
module.exports = router;