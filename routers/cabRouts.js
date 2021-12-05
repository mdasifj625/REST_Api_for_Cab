const express = require('express');
const authController = require('../controllers/authController');
const cabController = require('../controllers/cabController');
const router = express.Router();

router.use(authController.protect)

router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(cabController.getAllCabs)
    .post(cabController.createCab);

router
    .route('/:id')
    .get(cabController.getCab)
    .patch(cabController.updateCab)
    .delete(cabController.deleteCAb);
module.exports = router;