import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

const Loading = ({ fullScreen = true, message = "Loading..." }) => {
  
  if (fullScreen) {
    return (
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 999, 
          flexDirection: 'column',
          gap: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}
        open={true}
      >
        <CircularProgress color="inherit" size={60} thickness={4} />
        <Typography variant="h6" fontWeight="500" sx={{ letterSpacing: 1 }}>
          {message}
        </Typography>
      </Backdrop>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '300px',
        width: '100%',
        gap: 2
      }}
    >
      <CircularProgress color="primary" size={40} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;