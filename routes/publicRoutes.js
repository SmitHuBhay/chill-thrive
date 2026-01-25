const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// 1. Home Page
router.get('/', publicController.getHome);

// 2. Services Page
router.get('/services', publicController.getServices);

// 3. Booking Page
router.get('/book', publicController.getBooking);
router.post('/book', publicController.postBooking);

// 4. API for Availability (Used by the Booking Page script)
router.get('/api/availability', publicController.checkAvailability);

// 5. Founder Page
router.get('/founder', publicController.getFounder);

// 6. Awareness/Blog Page
router.get('/awareness', publicController.getAwareness);

// 7. Feedback Page
router.get('/feedback', publicController.getFeedback);
router.post('/feedback', publicController.postFeedback);

module.exports = router;