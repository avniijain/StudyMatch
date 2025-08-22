import express from 'express'
import protect from '../middleware/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, userController.getMe);
router.put('/profile', protect, userController.updateProfile);

export default router