const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.getHome);
router.get('/services', publicController.getServices);
router.get('/book', publicController.getBooking);
router.post('/book', publicController.postBooking);
router.get('/api/availability', publicController.checkAvailability); //api route for checking availability of date
router.get('/founder', publicController.getFounder);
router.get('/awareness', publicController.getAwareness);
router.get('/feedback', publicController.getFeedback);
router.get('/contact', publicController.getContact);
router.post('/feedback', publicController.postFeedback);

module.exports = router;