import express from 'express';
import { createRoom, joinRoom, deleteRoom, getRoom, leaveRoom } from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/create', protect , createRoom);
router.post('/join', protect, joinRoom);
router.get('/getRoom/:roomId', protect, getRoom);
router.post('/delete/:roomId', protect, deleteRoom);
router.post('/leave/:roomId', protect, leaveRoom);


export default router;