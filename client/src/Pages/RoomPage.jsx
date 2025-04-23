import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatSection from '../components/ChatSection';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [username, setUsername] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const socketRef = useRef(socket);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1200px)');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/rooms/getRoom/${roomId}`, {
        withCredentials: true,
      })
      .then((res) => setRoom(res.data))
      .catch((err) => console.error('Failed to fetch room:', err));

    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/auth/checkAuth`, {
        withCredentials: true,
      })
      .then((res) => {
        const name = res.data.user.username;
        setUsername(name);
        socketRef.current.connect();
        socketRef.current.emit('join-room', { roomId, username: name });
      })
      .catch((err) => console.error('Failed to fetch user:', err));

    socketRef.current.on('room-deleted', () => {
      alert('This room has been deleted by the owner.');
      navigate('/home');
    });

    return () => {
      socketRef.current.off('room-deleted');
      socketRef.current.disconnect();
    };
  }, [roomId, navigate]);

  const handleDeleteClick = async () => {

    const confirmDelete = window.confirm('Are you sure you want to delete this room? This action cannot be undone.');
    if (!confirmDelete) return;
    
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/rooms/delete/${roomId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        bgcolor: '#1e1e2f',
        minHeight: '100vh',
        color: '#e0e0e0',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 3,
          maxWidth: isLargeScreen ? '95%' : '100%',
          margin: 'auto',
          bgcolor: '#2a2a40',
          color: '#e0e0e0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600} color="primary.light">
            {room?.title || 'Loading Room...'}
          </Typography>

          {room && username === room.owner.username && (
            <Tooltip title="Delete Room">
              <IconButton color="error" onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderColor: '#444' }} />

        {/* Small screen members button */}
        {!isLargeScreen && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <button
              onClick={() => setShowMembers(true)}
              style={{
                backgroundColor: '#2e2e44',
                color: '#e0e0e0',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              👥 View Members
            </button>
          </Box>
        )}

        {/* Overlay for members on small screen */}
        {!isLargeScreen && showMembers && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1300,
              display: 'flex',
              justifyContent: 'flex-start',
            }}
            onClick={() => setShowMembers(false)} // close when clicked outside
          >
            <Box
              sx={{
                width: '70%',
                maxWidth: '300px',
                bgcolor: '#1f1f33',
                p: 2,
                borderRight: '1px solid #444',
                height: '100%',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()} // prevent closing when inside panel
            >
              <Typography variant="subtitle1" gutterBottom color="primary.light">
                👥 Members
              </Typography>
              {room?.users.map((member) => (
                <Paper
                  key={member.username}
                  sx={{
                    p: 1,
                    px: 2,
                    mb: 1,
                    bgcolor: member.username === username ? '#353553' : '#2e2e44',
                    color: '#e0e0e0',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{member.username}</span>
                  {member.username === room?.owner.username && <span>👑</span>}
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* Main Content Layout */}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            flexDirection: isLargeScreen ? 'row' : 'column',
            gap: 3,
          }}
        >
          {/* User List Sidebar (for large screens) */}
          {isLargeScreen && (
            <Box
              sx={{
                width: '30%',
                bgcolor: '#1f1f33',
                p: 2,
                borderRadius: 2,
                border: '1px solid #333',
                overflowY: 'auto',
                maxHeight: '65vh',
              }}
            >
              <Typography variant="subtitle1" gutterBottom color="primary.light">
                👥 Members
              </Typography>
              {room?.users.map((member) => (
                <Paper
                  key={member.username}
                  sx={{
                    p: 1,
                    px: 2,
                    mb: 1,
                    bgcolor: member.username === username ? '#353553' : '#2e2e44',
                    color: '#e0e0e0',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{member.username}</span>
                  {member.username === room?.owner.username && <span>👑</span>}
                </Paper>
              ))}
            </Box>
          )}

          {/* Chat Section */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {room && username && (
              <ChatSection roomId={roomId} username={username} />
            )}
          </Box>
        </Box>

        {/* Code Collaboration Section */}
        <Box mt={4}>
          <Typography variant="h6" color="primary.light" gutterBottom>
            💻 Code Collaboration (Coming Soon)
          </Typography>
          <Paper sx={{ bgcolor: '#1c1c2e', p: 3, borderRadius: 2 }}>
            <Typography color="gray">
              This feature will let you collaborate on code in real time!
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}
