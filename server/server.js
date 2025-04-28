// server.js
import Message from './models/Message.js'
import Room from './models/Room.js'
import User from './models/User.js'

import dotenv from 'dotenv'
import app from './app.js'
import { Server } from 'socket.io'
import http from 'http'

dotenv.config()
const PORT = process.env.PORT || 5000

// Create raw HTTP server to attach socket.io. This will wrap the express app
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
})

const usersInRoom = {} // roomId => [ { socketId, username } ]

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId)
    if (!usersInRoom[roomId]) usersInRoom[roomId] = []
    usersInRoom[roomId].push({ socketId: socket.id, username })

    // Notify everyone in room
    io.to(roomId).emit('room-users', usersInRoom[roomId])
    console.log(`Socket ${socket.id} joined room ${roomId}`)
  })

  // Code editor related things:
  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-change", { code });
  });

  socket.on('send-message', async({sendername, content, roomId, timeStamp, fileUrl}) => {
    try{

      // 1.) find user
      const sender = await User.findOne({ username: sendername });

      // ONLY save to DB if fileUrl is not present (text-only msg)
      if (!fileUrl) {
        const newMsg = new Message({
          content, 
          room: roomId,
          sender: sender._id,
          timeStamp,
        });
        await newMsg.save();

        await Room.findByIdAndUpdate(roomId, { $push: { messages: newMsg._id } });
      }

      // // 2. Save message to DB
      // const newMsg = new Message({
      //   content, 
      //   room: roomId,
      //   sender: sender._id,
      //   fileUrl,
      //   timeStamp: timeStamp,
      // });
      // await newMsg.save();

      // // 3.) Push message to room.
      // await Room.findByIdAndUpdate(roomId, {
      //   $push: { messages: newMsg._id }
      // });

      // 4.) Broadcast message. 
      io.to(roomId).emit('receive-message', { 
        sender: sender.username,
        content,
        roomId, 
        timeStamp,
        fileUrl,
      })
    }
    catch(error){
      console.error('Failed to send message:', error);
    }
   
  })

  socket.on('disconnect', () => {
    // Remove user from all rooms
    for (const roomId in usersInRoom) {
      usersInRoom[roomId] = usersInRoom[roomId].filter(user => user.socketId !== socket.id)
      io.to(roomId).emit('room-users', usersInRoom[roomId])
    }
    console.log('User disconnected:', socket.id)
  })
})

// Start the server with socket.io support
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

export { io };