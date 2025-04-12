import express from 'express';
import Message from '../models/Message.js';

export const saveMessage = async(req, res) =>{
    try {
        const { content, roomId } = req.body;
        const senderId = req.user._id; // protect jwt middleware will populate req.user with the authenticated user.
    
        const message = await Message.create({
          room: roomId,
          sender: senderId,
          content
        });
    
        const populatedMsg = await message.populate('sender', 'username');
    
        res.status(201).json(populatedMsg);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
      }
}
export const getMessages = async(req, res) =>{
    try {
        const { roomId } = req.params;
    
        const messages = await Message.find({ room: roomId })
          .populate('sender', 'username')
          .sort({ sentAt: 1 });
    
        res.json(messages);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
      }
}