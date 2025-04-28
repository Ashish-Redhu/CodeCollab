import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import authRoutes from './routes/authRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import messageRoutes from './routes/messageRoutes.js';
import './config/passport.js'

import axios from 'axios';
dotenv.config()

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";
// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'CLIENT_URL']
// for (const envVar of requiredEnvVars) {
//   if (!process.env[envVar]) {
//     throw new Error(`Missing required environment variable: ${envVar}`)
//   }
// }

const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST"],
  credentials: true
}))

// Passport
app.use(passport.initialize())

// DB Connect
async function connectToMongoDB() {
    try 
    {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB!');
    } 
    catch (error) 
    {
      console.error('Error connecting to MongoDB:', error);
    }
}
connectToMongoDB();

// Routes
app.get('/', (req, res) => {
  res.send('API is running...')
})
app.use('/api/auth', authRoutes);

app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

app.post('/run-code', async (req, res) => {
  const { language, version, files } = req.body

  try {
    const response = await axios.post(PISTON_API_URL, {
      language,
      version,
      files
    })
    res.json(response.data)
  } catch (error) {
    console.error('Error executing code:', error)
    res.status(500).json({ error: 'Error executing code' })
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


export default app
