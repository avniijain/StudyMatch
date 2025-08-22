import express from "express";
import protect from '../middleware/authMiddleware.js'
import roomController from '../controllers/roomController.js'

const router = express.Router();

router.get('/my', protect, roomController.getMyRooms);
router.get('/active', protect, roomController.getActiveRooms);
router.post('/create',protect, roomController.createRoom);
router.get('/suggested', protect, roomController.getSuggestedRooms);
router.get('/search', protect, roomController.searchRooms);
router.put('/join/:id', protect, roomController.joinRoom);
router.put('/leave/:id', protect, roomController.leaveRoom);
router.delete('/delete/:id', protect, roomController.deleteRoom);
router.get('/:id', protect, roomController.getRoomById);

export default router;