import { useParams } from 'react-router-dom'; // / To get dynamic roomId from the URL
import { useEffect, useState, useRef } from 'react';
import axios from 'axios'; // For API requests
import io from 'socket.io-client'; // For real-time communication using Socket.io
import {
  Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Divider
} from '@mui/material'
import { Menu, MenuItem, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';

import Chat from '../components/chat/Chat';

// Create a socket instance with autoConnect disabled for manual control
const socket = io(import.meta.env.VITE_SERVER_URL, {
    autoConnect: false,
    withCredentials: true, // Important if you're using cookies/sessions for auth
})

export default function RoomPage() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { roomId } = useParams()
  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState(''); // Current logged-in user's username
  const socketRef = useRef(socket); // Ref to keep the socket consistent across renders

  useEffect(() => {
    // 1.) fetch room details. 
    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/rooms/getRoom/${roomId}`, { withCredentials: true })
      .then(res => setRoom(res.data))
      .catch(err => console.error('Failed to fetch room:', err))

    // 2.) Get currently logged in user. 
    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/checkAuth`, { withCredentials: true })
        .then(res =>{
            const name = res.data.user.username;
            setUsername(name); 

            // 3.) Connect socket and join the room with the username
            socketRef.current.connect(); // Connect the socket
            socketRef.current.emit('join-room', { roomId, username: name });
        })
        .catch(err => console.error('Failed to fetch user:', err));
    
    // 2.2. Fetch all messages of the room (populate sender usernames)
    const fetchMessage = async () => {
        try{
            const messagesRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/messages/${roomId}`, { withCredentials: true });
            const formattedMsgs = messagesRes.data.map(msg => ({
                content: `${msg.sender.username}: ${msg.content}`,
                roomId: msg.room,
            }));
            setMessages(formattedMsgs); // Set messages with sender usernames
        }
        catch(err){
            console.error('Failed to fetch messages:', err);
        }
        
    }
    fetchMessage(); // Call the function to fetch messages
    

    // 4.) Listen for real-time messages.
    socketRef.current.on('receive-message', (message) => {
        setMessages((prev) => [...prev, message]);
    })

    // 5.) Listen for room users (who leaves and joins);
    socketRef.current.on('room-users', (roomUsers) => {
        setUsers(roomUsers);
    });

    // 6.) Cleanup on unmount
    return ()=>{
        socketRef.current.off('receive-message')
        socketRef.current.off('room-users')
        socketRef.current.disconnect(); // Gracefully leave the room
        setMessages([]); // Clear messages when leaving
        setUsers([]); // Clear user list
    }
  }, [roomId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return // Don't send empty message.
    
    // Structure the message data
     const messageData = {
        sendername:username,
        content: newMessage, 
        roomId
      };

    // Emit the message to the server
    socketRef.current.emit('send-message', messageData);

    // Also add it to our local state for instant feedback
    //setMessages(prev => [...prev, messageData]); // Optimistic update

    // Clear the input box
    setNewMessage('');
  }
  
  // Delete Room method
  const handleDeleteClick = async()=>{
    try{
      console.log("Delete started frontend.....");
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/rooms/delete/${roomId}`, {}, {withCredentials: true});
      alert(response.data.message);
      navigate('/home');
    }
    catch(err){
      alert(err.message);
    }
    
  }

 return (
    <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Room Title */}
      <Typography variant="h4">
        {room?.title || 'Loading Room...'}
      </Typography>
      <button onClick={handleDeleteClick}>Delete Room</button>


      <Chat/>
      
      {/* 🧑‍🤝‍🧑 Users in Room */}
      <Paper sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">
                🧑‍🤝‍🧑 Total Users in Room ({room?.users.length || 0})
            </Typography>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                <ArrowDropDownIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                style: {
                    maxHeight: 300,
                    width: '20ch',
                },
                }}
            >
                {room?.users.map((user, index) => (
                <MenuItem key={index}>{user.username}</MenuItem>
                ))}
            </Menu>
        </Box>


        <Typography variant="h6">👥 Active People in Room ({users.length})</Typography>
        <List dense>
          {users.map((user, index) => (
            <ListItem key={index}>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* 💬 Chat Section */}
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h6">💬 Chat {username}</Typography>

        {/* Chat messages display area */}
        <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 2, mb: 2 }}>
          {messages.map((msg, index) => (
            <Typography key={index} sx={{ mb: 1 }}>{msg.content}</Typography>
          ))}
        </Box>

        {/* Input and Send Button */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <Button variant="contained" color="primary" onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Paper>

      {/* 🧑‍💻 Code Editor Placeholder */}
      <Paper sx={{ padding: 2, border: '1px dashed gray' }}>
        <Typography variant="h6" color="gray">
          🧑‍💻 Code Collaboration (Coming Soon)
        </Typography>
        <Typography color="text.secondary">
          Collaborative editor will appear here.
        </Typography>
      </Paper>
    </Box>
  );
}

// useRef is used so the socket instance doesn’t get recreated on every render.
// useEffect is triggered whenever roomId changes (like when navigating between rooms).
// Messages are stored locally first for quick updates, even before confirmation from the server.