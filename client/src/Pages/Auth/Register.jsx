import { useState } from 'react'
import { TextField, Button, Stack, Typography, Box, Paper, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../context/authContext'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate()
  const { checkAuth } = useAuth()
  const SERVER_URL = import.meta.env.VITE_SERVER_URL; 

  const handleRegister = async (e) => {
    if(username=='' || email=='' || password=='' || confirmPassword==''){
      alert('All fields are mendatory'); return;
    }
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
    
    <div>
       <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          color="secondary"
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            top: '20px', // Adjust the top position
            left: '20px', // Adjust the left position
          }}
        >
          Back
        </Button>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
                InputLabelProps={{ style: { color: '#aaa' } }}
                InputProps={{ style: { color: '#fff' } }}
                InputProps={{
                  sx: { color: '#fff' },
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
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Confirm Passkey"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                sx={{ mb: 2 }}
                error={confirmPassword !== "" && password !== confirmPassword}
                helperText={confirmPassword !== "" && password !== confirmPassword ? "Passwords do not match" : ""}
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{
                  sx: { color: '#fff' },
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
              />
            <Button
              variant="outlined"
              fullWidth
              onClick={handleRegister}
              disabled={
                !username || !email || password !== confirmPassword
              }
              sx={{ mt: 1, color: '#fff', borderColor: '#fff' }}
            >
              Create Room
            </Button>
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                Already have an account?{' '}
                <RouterLink to="/login" style={{ color: '#90caf9', textDecoration: 'underline' }}>
                  Login
                </RouterLink>
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Box>
    </div>
  )
}
