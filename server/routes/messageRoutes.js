import express from 'express';
import Message from '../models/Message.js';
import { saveMessage } from '../controllers/messageController.js';
import { getMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

// File upload related imports.
import multer from 'multer';
import { upload } from '../utils/cloudinary.js';

// const upload = multer({ storage });
const router = express.Router();

router.post('/save', protect, upload.single('file'), saveMessage);

// Get all messages in a room
router.get('/:roomId', protect, getMessages);
export default router;

