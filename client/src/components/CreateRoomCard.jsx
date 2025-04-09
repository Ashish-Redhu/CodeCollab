// src/components/CreateRoomCard.jsx
import React from 'react'
import { Paper, Typography, TextField, Button, Box } from '@mui/material'

export default function CreateRoomCard() {
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
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Set Passkey"
          type="password"
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1, color: '#fff', borderColor: '#fff' }}
        >
          Create Room
        </Button>
      </Box>
    </Paper>
  )
}
