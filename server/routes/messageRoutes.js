import express from 'express';
import Message from '../models/Message.js';
import { saveMessage } from '../controllers/messageController.js';
import { getMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();


// Save message
router.post('/save', protect, saveMessage);

// Get all messages in a room
router.get('/:roomId', protect, getMessages);
export default router;

