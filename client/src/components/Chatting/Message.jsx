// components/chat/Message.jsx

import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

function Message({ sendername, content, timeStamp, fileUrl, isSender }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const formattedTime = new Date(timeStamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Define media dimensions based on screen size
  const mediaDimensions = {
    width: isMobile ? '100%' : '400px',
    height: isMobile ? 'auto' : '300px',
    maxWidth: '100%',
    objectFit: 'contain'
  };

  const renderFile = () => {
    if (!fileUrl) return null;

    const fileName = fileUrl.split('/').pop().split('?')[0];
    const ext = fileName.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return (
        <Box mt={1}>
          <img 
            src={fileUrl} 
            alt={fileName} 
            style={{ 
              ...mediaDimensions,
              borderRadius: 8 
            }} 
          />
          <DownloadLink fileUrl={fileUrl} fileName={fileName} />
        </Box>
      );
    }

    if (['mp3', 'wav', 'ogg'].includes(ext)) {
      return (
        <Box mt={1}>
          <audio controls src={fileUrl} style={{ width: '100%' }} />
          <DownloadLink fileUrl={fileUrl} fileName={fileName} />
        </Box>
      );
    }

    if (['mp4', 'webm', 'mov'].includes(ext)) {
      return (
        <Box mt={1}>
          <video 
            controls 
            src={fileUrl} 
            style={{ 
              ...mediaDimensions,
              borderRadius: 8 
            }} 
          />
          <DownloadLink fileUrl={fileUrl} fileName={fileName} />
        </Box>
      );
    }

    return <DownloadLink fileUrl={fileUrl} fileName={fileName} />;
  };

  const DownloadLink = ({ fileUrl, fileName }) => (
    <Typography variant="body2" mt={1}>
      📎 <a href={fileUrl} download={fileName} target="_blank" rel="noopener noreferrer">
        Download {fileName}
      </a>
    </Typography>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSender ? 'flex-end' : 'flex-start',
        mb: 1.5,
        width: '100%'
      }}
    >
      {!isSender && (
        <Typography
          variant="caption"
          sx={{ mb: 0.5, color: 'grey', ml: 1 }}
        >
          {sendername}
        </Typography>
      )}

      {/* Message Bubble */}
      {(content || fileUrl) && (
        <Box
          sx={{
            color: 'black',
            borderRadius: 2,
            padding: 1.5,
            backgroundColor: isSender ? '#DCF8C6' : '#ECECEC',
            maxWidth: '70%',
            wordBreak: 'break-word',
          }}
        >
          {content && <Typography variant="body2">{content}</Typography>}
          {renderFile()}
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{
          color: 'gray',
          mt: 0.5,
          alignSelf: isSender ? 'flex-end' : 'flex-start',
        }}
      >
        {formattedTime}
      </Typography>
    </Box>
  );
}

export default Message;