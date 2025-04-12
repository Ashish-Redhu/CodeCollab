import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import axios from 'axios'

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const { user, setIsAuthenticated } = useAuth()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {
        withCredentials: true,
      })
      setIsAuthenticated(false)
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      handleMenuClose()
    }
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#111' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold">
          CodeCollab
        </Typography>

        {user && (
          <>
            <IconButton onClick={handleMenuOpen}>
              {user.avatar ? (
                <Avatar alt={user.username} src={user.avatar} />
              ) : (
                <Avatar sx={{ bgcolor: '#555' }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled>
                <Typography variant="body1" fontWeight="bold">
                  {user.username}
                </Typography>
              </MenuItem>

              {/* Owned Rooms */}
              <MenuItem disabled>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  Owned Rooms
                </Typography>
              </MenuItem>
              {user.ownedRooms?.map((room) => (
                <MenuItem key={room._id} onClick={() => navigate(`/room/${room._id}`)}>
                  {room.title}
                </MenuItem>
              ))}

              {/* Joined Rooms */}
              <MenuItem disabled>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  Joined Rooms
                </Typography>
              </MenuItem>
              {user.joinedRooms?.map((room) => (
                <MenuItem key={room._id} onClick={() => navigate(`/room/${room._id}`)}>
                  {room.title}
                </MenuItem>
              ))}



              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
