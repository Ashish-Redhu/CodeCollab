import { AppBar, Toolbar, Typography, IconButton, Avatar, Drawer, Box, Divider, List, ListItem, ListItemText, useTheme, useMediaQuery, Button } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios'

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const { user, setIsAuthenticated } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const {checkAuth} = useAuth();

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {
        withCredentials: true,
      })
      setIsAuthenticated(false)
      navigate('/')
      await checkAuth();
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setDrawerOpen(false)
    }
  }

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: '#111'}}>
        <Toolbar sx={{ justifyContent: 'space-between',}}>
          <Typography variant="h6" fontWeight="bold">
            CodeCollab
          </Typography>

          {user && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              {user.avatar ? (
                <Avatar alt={user.username} src={user.avatar} />
              ) : (
                <Avatar sx={{ bgcolor: '#555' }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Slide-in Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? '80%' : 320,
            padding: 2,
            backgroundColor: '#1e1e1e',
            color: 'white',
          },
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {user?.username}
          </Typography>

          <Divider sx={{ bgcolor: 'gray', mb: 2 }} />

           {/* Home Button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                mb: 2,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
              onClick={() => {
                navigate('/');
                setDrawerOpen(false);
              }}
            >
              Home
            </Button>

          {/* Owned Rooms */}
          {user.ownedRooms.length > 0 && <Typography variant="body2" color="primary" fontWeight="bold" gutterBottom>
            Owned Rooms
          </Typography>}
          
          <List>
            {user?.ownedRooms?.map((room) => (
              <ListItem
                button
                key={room._id}
                onClick={() => {
                  navigate(`/room/${room._id}`)
                  setDrawerOpen(false)
                }}
                sx={{
                  borderRadius: 1,
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#333',
                    cursor: 'pointer',
                  },
                }}
              >
                <ListItemText primary={room.title} />
              </ListItem>
            ))}
          </List>

          {/* Joined Rooms */}
          {user?.joinedRooms.length > 0 && (
            <Typography variant="body2" color="primary" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Joined Rooms
            </Typography>
          )}
          <List>
            {user?.joinedRooms?.map((room) => (
              <ListItem
                button
                key={room._id}
                onClick={() => {
                  navigate(`/room/${room._id}`)
                  setDrawerOpen(false)
                }}
                sx={{
                  borderRadius: 1,
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#333',
                    cursor: 'pointer',
                  },
                }}
              >
                <ListItemText primary={room.title} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ bgcolor: 'gray', mt: 3, mb: 2 }} />

          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderColor: '#f44336',
              '&:hover': {
                backgroundColor: '#f44336',
                color: 'white',
              },
            }}
          >
            Logout
          </Button>
          
          <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                backgroundColor: '#333',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#555',
                },
                borderRadius: '50%',
                boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
              }}
            >
              <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Drawer>
    </div>
  )
}
