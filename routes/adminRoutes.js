const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const path = require('path');

//multer setup for file uploads
const storage = multer.diskStorage({
    destination: './public/uploads/', // Files will be saved here
    filename: function(req, file, cb){
        // Save as: timestamp-filename.jpg
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Check file type 
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
});

//authentication middleware for admin routes
const auth = (req, res, next) => {
    if (req.session.admin) {
        return next();
    }
    res.redirect('/admin/login');
};


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

// Blog Management
router.post('/blog/add', auth, upload.single('image'), adminController.createContent);

router.get('/content/edit/:id', auth, adminController.getEditContent);
router.post('/content/edit/:id', auth, adminController.updateContent);
router.get('/content/delete/:id', auth, adminController.deleteContent);

// Feedback
router.post('/feedback/approve/:id', auth, adminController.approveTestimonial);
router.post('/service', auth, adminController.createService);
router.post('/service/update/:id', auth, adminController.updateService);
//delete service
router.get('/service/delete/:id', auth, adminController.deleteService);

//feedback approve
router.post('/feedback/approve/:id', auth, adminController.approveTestimonial);
//reply to feedback
router.post('/feedback/reply/:id', auth, adminController.replyToFeedback);
router.post('/schedule/update', auth, adminController.updateSchedule);
module.exports = router;