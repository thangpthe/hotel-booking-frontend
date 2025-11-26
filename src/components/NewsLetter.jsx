import { Box, Container, Typography, TextField, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import toast from 'react-hot-toast';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    
    // TODO: Send to backend
    setTimeout(() => {
      toast.success('Subscribed successfully! 🎉');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <Box 
      component="section" 
      py={8} 
      sx={{ 
        background: '#1976D2',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          top: '-100px',
          right: '-100px',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          bottom: '-50px',
          left: '-50px',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          
          {/* Icon */}
          <EmailIcon sx={{ fontSize: { xs: 50, md: 60 }, mb: 2, opacity: 0.9 }} />
          
          {/* Title */}
          <Typography 
            variant='h3' 
            component="h2" 
            gutterBottom 
            fontWeight="bold"
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Stay Updated
          </Typography>
          
          {/* Description */}
          <Typography 
            variant='body1' 
            sx={{ 
              fontSize: { xs: '1rem', md: '1.125rem' },
              mb: 4,
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Subscribe to our newsletter and get exclusive deals, travel tips, and the latest hotel offers delivered to your inbox!
          </Typography>

          {/* Subscription Form */}
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              maxWidth: '500px', 
              mx: 'auto' 
            }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                p: 1,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={<SendIcon />}
                sx={{
                  bgcolor: '#000',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  minWidth: { xs: '100%', sm: 'auto' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: '#5568d3',
                  },
                  '&:disabled': {
                    bgcolor: '#9ca3af',
                  }
                }}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </Stack>
          </Box>

          {/* Privacy note */}
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 2, 
              display: 'block',
              opacity: 0.7,
              fontSize: '0.875rem'
            }}
          >
            We respect your privacy. Unsubscribe at any time.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsLetter;