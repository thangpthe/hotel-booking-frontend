import React from 'react';
import { assets } from '../assets/assets';
import { Button, Container, Grid, Typography, Box, Stack } from '@mui/material';

const Hero = () => {
  return (
    <Box component="main" sx={{ py: 12, backgroundColor: '#ffffff', overflow: 'hidden' }}> 
      <Container maxWidth="xl">
        
        <Grid 
            container 
            spacing={4} 
            justifyContent="space-between" 
            alignItems="center"
        >
          <Grid item xs={12} md={5} lg={5}>
            
            <Typography 
              variant="h2" 
              component="h1" 
              fontWeight="900" 
              sx={{ 
                mb: 3, 
                lineHeight: 1.2,
                fontSize: { xs: '2.8rem', md: '3.8rem' },
                color: '#000'
              }}
            >
              Forget Busy Work, <br />
              <span style={{ color: '#1976d2' }}>Start New Vacation</span>
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 5, fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '480px' }}
            >
              We provide what you need to enjoy your holiday with family. 
              Time to make another memorable moment.
            </Typography>

            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                borderRadius: '30px', 
                textTransform: 'none', 
                px: 5, 
                py: 1.8,
                mb: 8, 
                boxShadow: '0px 10px 25px rgba(25, 118, 210, 0.3)',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Show More
            </Button>

        
          </Grid>

        
          <Grid item xs={12} md={6} lg={6}>
            <Box 
              sx={{ 
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                pl: { md: 4, lg: 8 } 
              }}
            >
              <Box 
                component="img" 
                src={assets.hero_img} 
                alt="Hero Vacation" 
                sx={{ 
                  width: '100%', 
                  maxWidth: '650px', 
                  height: 'auto',
                  objectFit: 'cover', 

                  borderTopLeftRadius: { xs: '120px', md: '240px' }, 
                  borderRadius: '24px', 
                  boxShadow: '0px 20px 60px rgba(0,0,0,0.08)'
                }} 
              />
            </Box>
          </Grid>

        </Grid>


        
      </Container>
    </Box>
  )
}

export default Hero;