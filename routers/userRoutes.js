const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .post('/signup',
        authController.signup);

router
    .post('/signin',
        authController.signin);

router
    .get('/logout',
        authController.logout);


// Protect all the rout after this point
router.use(authController.protect);

router
    .get('/me',
        userController.getMe,
        userController.getUser);

router
    .patch('/updateme',
        userController.updateMe);

router
    .delete('/deleteme',
        userController.deleteMe);


// Restrict to only admin after this point
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;