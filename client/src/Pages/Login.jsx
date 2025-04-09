import { useState } from 'react'
import { TextField, Button, Stack, Typography, Box, Paper } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { checkAuth } = useAuth()
  const SERVER_URL = import.meta.env.VITE_SERVER_URL; 

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${SERVER_URL}/api/auth/login`, { email, password }, { withCredentials: true })
      await checkAuth()
      navigate('/home')
    } catch (err) {
      alert('Login failed: ' + err.response?.data?.message || err.message)
    }
  }

  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #000000, #1a1a1a)', // black background
        padding: '20px',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 3,
          width: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.05)', // glass effect
          backdropFilter: 'blur(8px)',
          color: '#fff',
        }}
      >
        <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <Stack spacing={2}>
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
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}
