// src/components/CreateRoomCard.jsx
import React from 'react'
import { Paper, Typography, TextField, Button, Box } from '@mui/material'
const serverUrl = import .meta.env.VITE_SERVER_URL;
import axios from 'axios'
export default function CreateRoomCard() {
  const [roomDetails, setRoomDetails] = React.useState({ title: "", passkey: "" });
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Room creation started FRONTEND:", roomDetails);
    
    try{
      const newRoom = await axios.post(
        `${serverUrl}/api/rooms/create`,
        {
          title: roomDetails.title,
          passkey: roomDetails.passkey,
        },
        { withCredentials: true }
      );
      alert("Room created successfully!");
      setRoomDetails({ title: "", passkey: "" });

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 4,
        backgroundColor: '#2c2c2c',
        color: '#fff',
        borderRadius: 4,
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
          type="password"
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <Button
          variant="outlined"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 1, color: '#fff', borderColor: '#fff' }}
        >
          Create Room
        </Button>
      </Box>
    </Paper>
  )
}
