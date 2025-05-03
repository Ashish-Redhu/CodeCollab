import express from 'express';
import Message from '../models/Message.js';
import Room from '../models/Room.js';
import { io } from '../server.js';

export const saveMessage = async(req, res) =>{
    try {
        const { sendername, content, roomId, timeStamp } = req.body;
        const senderId = req.user._id; // protect jwt middleware will populate req.user with the authenticated user.
         
        let fileUrl = null;
        let fileType = "none";

        if(req.file){

          console.log("Uploaded file info: "+req.file);
          fileUrl = req.file.path;
          const mimeType = req.file.mimetype;
   
          if (mimeType.includes("image")) fileType = "image";
          else if (mimeType.includes("video")) fileType = "video";
          else if (mimeType.includes("audio")) fileType = "audio";
        }
    
        const message = await Message.create({
          room: roomId,
          sender: senderId,
          content,
          fileUrl,
          fileType,
        }); 
        await Room.findByIdAndUpdate(roomId, {
          $push: { messages: message._id }
        });      
    
        const populatedMsg = await message.populate('sender', 'username');
        // res.status(201).json(populatedMsg);
        io.to(roomId).emit('receive-message', { 
          sender: sendername,
          content,
          timeStamp,
          fileUrl,
        });
        return res.status(200).json({success: true, message: populatedMsg});
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
          .sort({ timeStamp: 1 })
          .limit(20); // This is called paging which will only a few messages (20) here to load at a time. 
    
        res.json(messages);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
      }
}