import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { TextField, Button, Stack, Typography, Paper, Box, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import axios from 'axios'

export default function ResetUserPass() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const emailParam = params.get('email')

  const [email, setEmail] = useState(emailParam || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const SERVER_URL = import.meta.env.VITE_SERVER_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      return alert('Passwords do not match')
    }
    else if (emailParam !== email) {
      return alert('Email does not match the one sent for reset')
    }
    try {
      await axios.post(`${SERVER_URL}/api/auth/reset-password`, {
        email,
        newPassword,
        token,
      }, { withCredentials: true })
      alert('Password successfully reset!')
      navigate('/login')
    } catch (err) {
      alert('Reset failed: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, backgroundColor: '#121212', minHeight: '100vh'}}>
      <Paper sx={{ padding: 4, width: 400, backgroundColor: '#1d1d1d', color: '#fff', borderRadius: '8px' }}>
        <Typography variant="h5" mb={3} textAlign="center" sx={{ color: '#fff' }}>Reset Your Password</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              InputProps={{ readOnly: true }}
              required
              sx={{ input: { color: '#fff' }, label: { color: '#aaa' }, backgroundColor: '#333' }}
            />
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              InputProps={{
                sx: { color: '#fff', backgroundColor: '#333' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(prev => !prev)}
                      edge="end"
                      sx={{ color: '#aaa' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{ input: { color: '#fff' }, label: { color: '#aaa' }, backgroundColor: '#333' }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}>
              Reset Password
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}
