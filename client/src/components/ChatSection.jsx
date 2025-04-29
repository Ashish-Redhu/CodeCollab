// components/chat/ChatSection.jsx
import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Paper, 
  Avatar,
  Badge,
  Tooltip
} from '@mui/material';
import { Send, AttachFile, Close } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import Message from './Message';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default function ChatSection({ roomId, username, totalUsers }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/messages/${roomId}`, { 
          withCredentials: true 
        });
        const formattedMsgs = messagesRes.data.map(msg => ({
          sender: msg.sender.username,
          content: msg.content,
          fileUrl: msg.fileUrl, 
          timeStamp: msg.timeStamp,
        }));
        setMessages(formattedMsgs);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchMessages();

    // socket.connect();
    // socket.emit('join-room', { roomId, username });
    
    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // socket.on('room-users', (roomUsers) => {
    //   setUsers(roomUsers);
    // });

    socket.on('typing', ({ isTyping }) => {
      setIsTyping(isTyping);
    });

    return () => {
      socket.off('receive-message');
      socket.off('room-users');
      socket.off('typing');
      socket.disconnect();
    };
  }, [roomId, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleFileChange = (e) => {
    if (!e.target.files[0]) return;
    setFile(e.target.files[0]);
  };

  const handleTyping = () => {
    socket.emit('typing', { roomId, isTyping: newMessage.length > 0 });
  };

  const sendMessage = () => {
    if (!newMessage.trim() && !file) return;

    const messageData = {
      sendername: username,
      content: newMessage,
      roomId,
      timeStamp: new Date().toISOString(),
    };

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('roomId', roomId);
      formData.append('sendername', username);

      axios.post(`${import.meta.env.VITE_SERVER_URL}/api/messages/save`, formData, {
        withCredentials: true, 
      }).then((res) => {
        const {sender, content, fileUrl, timeStamp} = res.data; 
        socket.emit('send-message', { 
          sendername: sender.username, 
          content, 
          fileUrl, 
          roomId, 
          timeStamp 
        });
      }).catch((err) => {
        console.error('Upload Error:', err);
      });
    } else {
      socket.emit('send-message', messageData);
    }

    setNewMessage('');
    setFile(null);
    socket.emit('typing', { roomId, isTyping: false });
  };

  return (
    <Paper 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
        padding: 0,
        backgroundColor: '#121212',
        color: '#e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }} 
      elevation={0}
    >
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: '#1e1e1e',
        borderBottom: '1px solid #2e2e2e',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Group Chat
          </Typography>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box sx={{
                backgroundColor: '#4caf50',
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '2px solid #1e1e1e'
              }} />
            }
          >
            <Avatar sx={{ 
              width: 32, 
              height: 32,
              bgcolor: '#3a7bd5',
              fontSize: '0.875rem'
            }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
        </Box>
        <Typography variant="body2" sx={{ color: '#a0a0a0'}}>
          {totalUsers} {totalUsers === 1 ? 'member' : 'members'} in total
        </Typography>
      </Box>

      {/* Messages container */}
      <Box 
        sx={{ 
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1e1e1e',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#3a3a3a',
            borderRadius: '4px',
            '&:hover': {
              background: '#4a4a4a',
            }
          },
          background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
        }} 
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: username === msg.sender ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Message
              sendername={msg.sender}
              content={msg.content}
              timeStamp={msg.timeStamp}
              fileUrl={msg.fileUrl}
              isSender={username === msg.sender}
            />
          </Box>
        ))}
        {isTyping && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            padding: '8px 12px',
            backgroundColor: '#252525',
            borderRadius: '18px',
            width: 'fit-content',
          }}>
            <Box sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#a0a0a0',
              animation: 'pulse 1.5s infinite ease-in-out',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.3, transform: 'translateY(0)' },
                '50%': { opacity: 1, transform: 'translateY(-5px)' },
              },
              '&:nth-of-type(1)': { animationDelay: '0s' },
              '&:nth-of-type(2)': { animationDelay: '0.3s' },
              '&:nth-of-type(3)': { animationDelay: '0.6s' },
            }} />
            <Box sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#a0a0a0',
            }} />
            <Box sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#a0a0a0',
            }} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box sx={{ 
        padding: '16px',
        backgroundColor: '#1e1e1e',
        borderTop: '1px solid #2e2e2e',
      }}>
        {file && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
            padding: '8px 12px',
            backgroundColor: '#252525',
            borderRadius: '4px',
          }}>
            <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
              {file.name}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => setFile(null)}
              sx={{ color: '#a0a0a0' }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Attach file">
            <IconButton 
              component="label"
              sx={{ 
                color: '#a0a0a0',
                '&:hover': {
                  backgroundColor: '#2a2a2a',
                  color: '#ffffff',
                }
              }}
            >
              <AttachFile />
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*,audio/*,video/*,.pdf"
              />
            </IconButton>
          </Tooltip>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#252525',
                borderRadius: '24px',
                '& fieldset': {
                  borderColor: '#2e2e2e',
                },
                '&:hover fieldset': {
                  borderColor: '#3a7bd5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3a7bd5',
                },
              },
              '& .MuiInputBase-input': {
                color: '#e0e0e0',
                padding: '12px 16px',
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={sendMessage}
            disabled={!newMessage.trim() && !file}
            sx={{
              minWidth: 'auto',
              padding: '8px 16px',
              borderRadius: '24px',
              backgroundColor: '#3a7bd5',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#2a6bc5',
              },
              '&:disabled': {
                backgroundColor: '#2a2a2a',
                color: '#606060',
              }
            }}
          >
            <Send fontSize="small" />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}