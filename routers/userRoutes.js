import { Router } from 'express';
import { getMe, getUser, updateMe, deleteMe, getAllUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { signup, signin, logout, protect, restrictTo } from '../controllers/authController.js';

const router = Router();

router
    .post('/signup',
        signup);

router
    .post('/signin',
        signin);

router
    .get('/logout',
        logout);


// Protect all the rout after this point
router.use(protect);

router
    .get('/me',
        getMe,
        getUser);

router
    .patch('/updateme',
        updateMe);

router
    .delete('/deleteme',
        deleteMe);


// Restrict to only admin after this point
router.use(restrictTo('admin'));

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);


export default router;