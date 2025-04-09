import { useState } from 'react'
import { TextField, Button, Stack, Typography, Box, Paper } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { checkAuth } = useAuth()
  const SERVER_URL = import.meta.env.VITE_SERVER_URL; 

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${SERVER_URL}/api/auth/register`, { username, email, password }, { withCredentials: true })
      await checkAuth() 
      navigate('/home')
    } catch (err) {
      alert('Registration failed: ' + err.response?.data?.message || err.message)
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #000000, #1c1c1c)',
        padding: '10px',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 5,
          borderRadius: 4,
          width: 420,
          background: 'linear-gradient(to right, #2c2c2c, #1e1e1e)',
          border: '1px solid #333',
          color: '#fff',
          boxShadow: '0px 0px 20px rgba(0,0,0,0.6)',
        }}
      >
        <Typography variant="h4" textAlign="center" mb={3} fontWeight="600">
          Register
        </Typography>

        <form onSubmit={handleRegister}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ style: { color: '#aaa' } }}
              InputProps={{ style: { color: '#fff' } }}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ style: { color: '#aaa' } }}
              InputProps={{ style: { color: '#fff' } }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ style: { color: '#aaa' } }}
              InputProps={{ style: { color: '#fff' } }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
              Register
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}
