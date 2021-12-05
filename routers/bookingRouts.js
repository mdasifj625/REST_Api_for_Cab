const express = require('express');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.use(authController.protect)

router.use(authController.restrictTo('user'));


router
    .get('/bookCab/:pickup/:drop',
        bookingController.findNearbyCab,
        bookingController.driverConfirmation,
        bookingController.bookCab);

router
    .route('/')
    .get(bookingController.getAllMyBookings)
    .post(bookingController.createBooking);

router
    .get('/:id', bookingController.getBooking);
module.exports = router;