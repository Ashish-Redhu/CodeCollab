// src/components/JoinRoomCard.jsx
import React from 'react'
import { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material'
import axios from 'axios'
const serverUrl = import .meta.env.VITE_SERVER_URL;
export default function JoinRoomCard() {
  const [roomDetails, setRoomDetails] = useState({ title: "", passkey: "" });

  const handleSubmit = async(e) => {
    e.preventDefault();    
    try{
      console.log("Joining start frontend....");
      const joinedRoom = await axios.post(
        `${serverUrl}/api/rooms/join`,
        {
          title: roomDetails.title,
          passkey: roomDetails.passkey,
        },
        { withCredentials: true }
      );
      alert("Room joined successfully!");
      setRoomDetails({ title: "", passkey: "" });

    }
    catch(error){
       // Handling errors and showing alerts
      if (error.response && error.response.status !== 200) {
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 4,
        backgroundColor: '#1f1f1f',
        color: '#fff',
        borderRadius: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Enter an Existing Room
      </Typography>
      <Typography variant="body1" gutterBottom>
        Join your friends or teammates by entering a room code.
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
          label="Room Passkey"
          type="password"
          value={roomDetails.passkey}
          onChange={(e) => setRoomDetails({ ...roomDetails, passkey: e.target.value })}
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 1 }}
        >
          Join Room
        </Button>
      </Box>
    </Paper>
  )
}
