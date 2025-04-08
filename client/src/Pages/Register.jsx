import { useState } from 'react'
import { TextField, Button, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export default function Register() {
  const [username, setusername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/auth/register', {username, email, password }, { withCredentials: true })
      setIsAuthenticated(true)
      navigate('/home')
    } catch (err) {
      alert('Registration failed: ' + err.response?.data?.message || err.message)
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <Stack spacing={2} maxWidth={400} mx="auto" mt={5}>
        <Typography variant="h5">Register</Typography>
        <TextField label="Username" type="text" value={username} onChange={e => setusername(e.target.value)} required />
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" variant="contained">Register</Button>
      </Stack>
    </form>
  )
}
