import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, IconButton, Tooltip, Divider, useMediaQuery, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatSection from '../components/Chatting/ChatSection.jsx';
import CodingPart from '../components/Coding/CodingPart.jsx';
import Navbar from '../components/Shared/Navbar.jsx'
import Footer from '../components/Shared/Footer.jsx'
import { io } from 'socket.io-client';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx'; 

const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  // const [username, setUsername] = useState('');
  const usernameRef = useRef(''); // Add this
  const [showActiveMembers, setShowActiveMembers] = useState(false);
  const [activeMembers, setActiveMembers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  // const totalMembersRef = useRef(0); // Add this
  const socketRef = useRef(socket);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1100px)');

  const {checkAuth} = useAuth(); // Import checkAuth from AuthContext

  // Code editor related things: 
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState('java');
  const [codeOutput, setCodeOutput] = useState('');
  const [codeRunning, setCodeRunning] = useState(false);

  const editorRef = useRef(null);

  const handleEditorChange = (value) => {
    setCode(value);
    socketRef.current.emit("code-change", { roomId: roomId, code: value });
  };
  const handleLanguageChange = (event) =>{
    setLanguage(event.target.value);
    socketRef.current.emit("language-change", { roomId: roomId, language: event.target.value });
  }

  const handleCodeOutputChange = (output) => {
    setCodeOutput(output);
    socketRef.current.emit("code-output-change", { roomId: roomId, codeOutput: output });
  }

  const handleCodeRunningChange = (running) => {
    setCodeRunning(running);    
    socketRef.current.emit("code-running-change", { roomId: roomId, codeRunning: running });
  }


  useEffect(() => {
    // console.log("Mounting RoomPage...");
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/rooms/getRoom/${roomId}`, {
        withCredentials: true,
      })
      .then((res) => {setRoom(res.data); 
        const total = res.data.users.length;
        setTotalMembers(total);
        // Emit to server: we send both roomId and total
        socketRef.current.emit('update-total-members', { roomId, total });
      })
      .catch((err) => console.error('Failed to fetch room:', err));

    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/auth/checkAuth`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log('username is: ', res.data.user.username);
        const name = res.data.user.username;
        usernameRef.current = name; 
        socketRef.current.connect();
        socketRef.current.emit('enter-room', { roomId, username: name });
      })
      .catch((err) => console.error('Failed to fetch user:', err));
    
    socketRef.current.on('room-users', (roomUsers) => {
      setActiveMembers(roomUsers);
    });

    socketRef.current.on('total-members-updated', (total)=> setTotalMembers(total)); // Update the ref with the new total
   
    socketRef.current.on('room-left', ({leftUsername, totalMembers}) => {
      console.log('User left:', leftUsername);
      console.log('username:', usernameRef.current);
      setActiveMembers(prevMembers => prevMembers.filter(m => m.username !== leftUsername));
      setTotalMembers(totalMembers); // Update the ref with the new total
      if (leftUsername === usernameRef.current) { 
        
        alert('You have left the room successfully!');
        navigate('/home');
      } 
      else {
        toast.info(`${leftUsername} has left the room.`);
      }  
    });
   
    socketRef.current.on('room-deleted', () => {
      alert('This room has been deleted by the owner.');
      navigate('/home');
    });

    return () => {
      console.log("Unmounting RoomPage...");
      socketRef.current.off('room-deleted');
      socketRef.current.off('code-change');
      socketRef.current.off('room-users');
      socketRef.current.off('room-left');
      socketRef.current.disconnect();
    };
  // }, [roomId, navigate]);
  }, [roomId, navigate]); // We are using it because we want to run useEffect again when userMoves to a different room on same page.


  const handleDeleteClick = async () => {

    const confirmDelete = window.confirm('Are you sure you want to delete this room? This action cannot be undone.');
    if (!confirmDelete) return;
    
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/rooms/delete/${roomId}`,
        {},
        { withCredentials: true }
      );
      await checkAuth();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeaveClick = async () => {
    console.log("Leaving room...");
    const confirmLeave = window.confirm('Are you sure you want to permanently leave this room?');
    if (!confirmLeave) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/rooms/leave/${roomId}`,
        {},
        { withCredentials: true }
      );
      await checkAuth();
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    socketRef.current.on("code-change", ({ code }) => {
      setCode(code);
    });
    socketRef.current.on("language-change", ({ language }) => {
      setLanguage(language);
    });
    socketRef.current.on("code-output-change", ({ codeOutput }) => {
      setCodeOutput(codeOutput);
    });
    socketRef.current.on("code-running-change", ({ codeRunning }) => {
      setCodeRunning(codeRunning);
    });
    return () => {
      socketRef.current.off("code-change");
      socketRef.current.off("language-change");
      socketRef.current.off("code-output-change");
      socketRef.current.off("code-running-change");
    };
  }, []);

  return (
    <>
    <Navbar/>
    <Box
      sx={{
        paddingY: 3,
        bgcolor: '#1e1e2f',
        minHeight: '100vh',
        color: '#e0e0e0',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 3,
          // borderRadius: 3,
          maxWidth: '100%',
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

          {room && usernameRef.current === room.owner.username && (
            <Tooltip title="Delete Room">
              <IconButton color="error" onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {room && usernameRef.current !== room.owner.username && (
            <Tooltip title="Leave Group">
            <IconButton color="warning" onClick={handleLeaveClick}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderColor: '#444' }} />

        {/* Small screen members button */}
        {!isLargeScreen && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <button
              onClick={() => setShowActiveMembers(true)}
              style={{
                backgroundColor: '#2e2e44',
                color: '#e0e0e0',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              👥 View Active Members
            </button>
          </Box>
        )}

        {/* Overlay for members on small screen */}
        {!isLargeScreen && showActiveMembers && (
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
            onClick={() => setShowActiveMembers(false)} // close when clicked outside
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
                👥 Active Members
              </Typography>

              {activeMembers.map((member) => (
                <Paper
                  key={member.socketId} // Changed to socketId because usernames can clash, socketId is unique
                  sx={{
                    p: 1,
                    px: 2,
                    mb: 1,
                    bgcolor: member.username === usernameRef.current ? '#353553' : '#2e2e44',
                    color: '#e0e0e0',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{member.username}</span>
                  {/* You can show crown 👑 if you have a way to check if this active member is owner */}
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
                👥 Active Members
              </Typography>
              {activeMembers.map((member) => (
                <Paper
                  key={member.socketId} // Changed to socketId because usernames can clash, socketId is unique
                  sx={{
                    p: 1,
                    px: 2,
                    mb: 1,
                    bgcolor: member.username === usernameRef.current ? '#353553' : '#2e2e44',
                    color: '#e0e0e0',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{member.username}</span>
                  {/* You can show crown 👑 if you have a way to check if this active member is owner */}
                  {member.username === room?.owner.username && <span>👑</span>}
                </Paper>
              ))}
            </Box>
          )}

          {/* Chat Section */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {room && usernameRef.current && (
              <ChatSection roomId={roomId} username={usernameRef.current} totalUsers={totalMembers} socket={socketRef.current}/>
            )}
          </Box>
        </Box>

        {/* Code Collaboration Section */}
        <Box mt={4}>
          <Typography variant="h6" color="primary.light" gutterBottom>
            💻 Code Collaboration
          </Typography>
          <Paper sx={{ bgcolor: '#1c1c2e', p: 3, borderRadius: 2 }}>
            <Typography color="gray">
              This feature will let you collaborate on code in real time!
            </Typography>
            <CodingPart value={code} onChange={handleEditorChange} language={language} handleLanguageChange={handleLanguageChange} codeOutput={codeOutput} handleCodeOutputChange={handleCodeOutputChange} codeRunning={codeRunning} handleCodeRunningChange={handleCodeRunningChange}/>
          </Paper>
        </Box>
      </Paper>
    </Box>
    <Footer/>
  </>
  );
}
