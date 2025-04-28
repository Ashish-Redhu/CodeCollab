// src/components/CreateRoomCard.jsx
import React from 'react'
import { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { toast } from 'react-toastify';

const serverUrl = import .meta.env.VITE_SERVER_URL;
import axios from 'axios'
export default function CreateRoomCard() {
  const [roomDetails, setRoomDetails] = React.useState({ title: "", passkey: "", });
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPasskey, setConfirmPasskey] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log("Room creation started FRONTEND:", roomDetails);
    
    try{
      const newRoom = await axios.post(
        `${serverUrl}/api/rooms/create`,
        {
          title: roomDetails.title,
          passkey: roomDetails.passkey,
        },
        { withCredentials: true }
      );
      // alert("Room created successfully!");
      toast.success('Room created successfully! ➡️ Click on your profile to view Owned/joined rooms.', {
        position: "top-right",
        autoClose: 5000, // visible for 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          marginRight: '75px', // move it a bit left from right edge
        },
      });

      setRoomDetails({ title: "", passkey: "", });
      setConfirmPasskey("");

    }
    catch(error){
       // Handling errors and showing alerts
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // Show alert with the message from backend
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };
  
  return (
    <Paper
      elevation={6}
      sx={{
        height: '100%',
        minHeight: 300,
        maxWidth: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 4,
        backgroundColor: '#2c2c2c',
        color: '#fff',
        borderRadius: 4,
        margin: '0 auto', // to center it inside grid
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create a New Room
      </Typography>
      <Typography variant="body1" gutterBottom>
        Start a new collaborative coding session with others.
      </Typography>
      <Box component="form" sx={{ mt: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Room Title"
          value={roomDetails.title}
          onChange={(e) => setRoomDetails({ ...roomDetails, title: e.target.value })}
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Set Passkey"
          value={roomDetails.passkey}
          onChange={(e) => setRoomDetails({ ...roomDetails, passkey: e.target.value })}
          type={showPassword ? 'text' : 'password'}
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
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
          value={confirmPasskey}
          onChange={(e) => setConfirmPasskey(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          sx={{ mb: 2 }}
          error={confirmPasskey !== "" && roomDetails.passkey !== confirmPasskey}
          helperText={confirmPasskey !== "" && roomDetails.passkey !== confirmPasskey ? "Passkeys do not match" : ""}
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
          onClick={handleSubmit}
          disabled={
            !roomDetails.title || !roomDetails.passkey || roomDetails.passkey !== confirmPasskey
          }
          sx={{ mt: 1, color: '#fff', borderColor: '#fff' }}
        >
          Create Room
        </Button>
      </Box>
    </Paper>
  )
}
