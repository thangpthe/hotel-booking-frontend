/* eslint-disable react-hooks/set-state-in-effect */
import React, {useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Box, Card, CardContent, CardMedia, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const MostPicked = () => {
    const [hotelData,setHotelData] = useState([]);
    const fetchHotels = async () => {
    try {
      const {data} = await axios.get("/api/hotel/get-all");
      if(data.success){
        setHotelData(data.hotels);
      }
      else{
        console.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchHotels();
  },[]);

  return (

    <Box component="section" py={8} >
      <Container maxWidth="xl">
        <Box sx={{mb: 6,textAlign:'center'}}>
            <Typography variant='h3' component="h2" gutterBottom >Most Picked Hotels</Typography>
            <Typography variant='body1' color='text.secondary'>Some most picked hotels</Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
           {hotelData.map((item,index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  }
                }}>
                <Box sx={{position:'relative'}}>
                    <CardMedia component="img" height="220px" sx={{objectFit:'cover' }} image={`${backendUrl}/images/${item.image}`} alt={item.otelName}/>
                    <Chip label={`$${item.price}`} color='primary' sx={{position:'absolute',top:16,right:16}}/>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} mb={1}>
                    <Typography variant='h6' fontWeight="bold" lineHeight={1.2}>
                      {item.hotelName}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                    <Typography variant='body2' color="text.secondary" noWrap>
                      {item.hotelAddress}
                    </Typography>
                  </Stack>
                </CardContent>  
            </Card>
            </Grid>
            ))}
        </Grid>

      </Container>
    </Box>
  )
}

export default MostPicked;