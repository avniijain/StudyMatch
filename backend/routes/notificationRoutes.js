import express from 'express';
import notificationController from '../controllers/notificationController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, notificationController.sendNotification);
router.get('/', protect, notificationController.getNotifications);
router.patch('/:id/read', protect, notificationController.markAsRead);
router.post('/send', protect, notificationController.sendJoinRequest);
router.post('/:id/accept', protect, notificationController.acceptJoinRequest);
router.post('/:id/reject', protect, notificationController.rejectJoinRequest);

export default router;
