import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import { getAllCabs, createCab, getCab, updateCab, deleteCAb } from '../controllers/cabController.js';
const router = Router();

router.use(protect)

router.use(restrictTo('admin'));

router
    .route('/')
    .get(getAllCabs)
    .post(createCab);

router
    .route('/:id')
    .get(getCab)
    .patch(updateCab)
    .delete(deleteCAb);
export default router;