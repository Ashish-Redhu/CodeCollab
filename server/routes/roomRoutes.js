import express from 'express';
import { createRoom, joinRoom, deleteRoom, getRoom } from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/create', protect , createRoom);
router.post('/join', protect, joinRoom);
router.post('/delete/:roomId', protect, deleteRoom);
router.get('/getRoom/:roomId', protect, getRoom);

export default router;