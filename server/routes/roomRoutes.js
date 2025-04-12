import express from 'express';
import { createRoom, joinRoom, getRoom } from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/create', protect , createRoom);
router.post('/join', protect, joinRoom);
router.get('/:roomId', protect, getRoom);

export default router;