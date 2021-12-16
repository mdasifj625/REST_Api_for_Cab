import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import { findNearbyCab, driverConfirmation, arangeCab, bookCab, getAllMyBookings, getBooking } from '../controllers/bookingController.js';
const router = Router();

router.use(protect)

router.use(restrictTo('user'));


router
    .get('/bookCab/:pickup/:drop',
        findNearbyCab,
        driverConfirmation,
        arangeCab,
        bookCab);

router
    .get('/getAllMyBookings', getAllMyBookings);

router
    .get('/:id', getBooking);

export default router;