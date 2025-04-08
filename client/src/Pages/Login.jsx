import { useState } from 'react'
import { TextField, Button, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/auth/login', { email, password }, { withCredentials: true })
      setIsAuthenticated(true)
      navigate('/home')
    } catch (err) {
      alert('Login failed: ' + err.response?.data?.message || err.message)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <Stack spacing={2} maxWidth={400} mx="auto" mt={5}>
        <Typography variant="h5">Login</Typography>
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" variant="contained">Login</Button>
      </Stack>
    </form>
  )
}
