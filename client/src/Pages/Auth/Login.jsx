import { useState } from 'react'
import { TextField, Button, Stack, Typography, Box, Paper, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import axios from 'axios'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const [openDialog, setOpenDialog] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { checkAuth } = useAuth()
  const SERVER_URL = import.meta.env.VITE_SERVER_URL; 

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${SERVER_URL}/api/auth/login`, { email, password }, { withCredentials: true })
      await checkAuth();
      navigate('/home')
    } catch (err) {
      alert('Login failed: ' + err.response?.data?.message || err.message)
    }
  }

  const handleForgotPassword = async () => {
    setLoading(true)
    try {
      await axios.post(`${SERVER_URL}/api/auth/forgot-password`, { email: resetEmail },  { withCredentials: true })
      alert('Password reset link has been sent to your email')
      setOpenDialog(false)
    } catch (err) {
      alert('Failed to send reset link: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
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
              <Button type="submit" variant="contained" fullWidth>
                Login
              </Button>
              <Typography variant="body2" sx={{ color: '#aaa', textAlign: 'center', cursor: 'pointer',  '&:hover': {color: '#1976d2'}}} onClick={() => setOpenDialog(true)}>
                Forgot Password?
              </Typography>
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                Don't have an account?{' '}
                <RouterLink to="/register" style={{ color: '#90caf9', textDecoration: 'underline' }}>
                  Signup
                </RouterLink>
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1e1e1e',
            color: '#f0f0f0',
            borderRadius: 2,
            p: 2,
            minWidth: 400,
          },
        }}
      >
  <DialogTitle sx={{ color: '#fff' }}>Reset Password</DialogTitle>
    <DialogContent>
      <Typography variant="body2" mb={1} sx={{ color: '#ccc' }}>
        Enter your registered email address
      </Typography>
      <TextField
        type="email"
        label="Email"
        variant="outlined"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        fullWidth
        sx={{
          input: { color: '#fff' },
          label: { color: '#aaa' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#555',
            },
            '&:hover fieldset': {
              borderColor: '#888',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
        }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenDialog(false)} color="secondary">
        Cancel
      </Button>
      <Button onClick={handleForgotPassword} disabled={loading} variant="contained" sx={{ bgcolor: '#1976d2' }}>
        {loading ? 'Sending...' : 'Send Link'}
      </Button>
    </DialogActions>
  </Dialog>

    </div>
  )
}
