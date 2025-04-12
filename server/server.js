// server.js
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

  socket.on('send-message', ({ content, roomId }) => {
    socket.to(roomId).emit('receive-message', { content })
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
