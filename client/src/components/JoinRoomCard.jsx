// src/components/JoinRoomCard.jsx
import React from 'react'
import { Paper, Typography, TextField, Button, Box } from '@mui/material'

export default function JoinRoomCard() {
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
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Room Passkey"
          type="password"
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 1 }}
        >
          Join Room
        </Button>
      </Box>
    </Paper>
  )
}
