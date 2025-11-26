/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Card, CardMedia, Grid, Chip, Stack, Divider, Button 
} from '@mui/material';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BedIcon from '@mui/icons-material/Bed';
import axios from 'axios';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookingData,setBookingData] = useState([]);
  const fetchMyBookings = async () => {
    try {
      const {data} = await axios.get("/api/bookings/hotel");
      
      if(data.success){
        setBookingData(data.bookings);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  
  useEffect(()=> {
      fetchMyBookings();
    },[]);
  const getStatusColor = (status) => {
    switch(status) {
      case "confirmed": return "success"; 
      case "pending": return "warning";   
      case "cancelled": return "error";  
      default: return "default";
    }
  };

  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <Box sx={{ py: 8, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        
        <Typography variant="h4" fontWeight="bold" gutterBottom mb={4}>
          All Bookings
        </Typography>

        
        <Stack spacing={3}>
          {bookingData.map((booking) => (
            <Card 
              key={booking._id} 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: '0.3s',
                '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }
              }}
            >
              
              <Box sx={{ width: { xs: '100%', md: '300px' }, height: { xs: '200px', md: 'auto' } }}>
                <CardMedia
                  component="img"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  image={`http://localhost:4000/images/${booking.room.images[0]}`} 
                  alt={booking.hotel.hotelName}
                />
              </Box>

           
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
               
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" color="#1a202c">
                      {booking.hotel.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                        <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.hotel.hotelAddress}
                        </Typography>
                    </Stack>
                  </Box>
                  
                 
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    ${booking.totalPrice}
                  </Typography>
                </Box>

                

               
                <Grid container spacing={2}>
                  
                 
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="row" spacing={1}>
                        <CalendarTodayIcon color="action" />
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Check-in - Check-out</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                            </Typography>
                        </Box>
                    </Stack>
                  </Grid>

                 
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="row" spacing={1}>
                        <BedIcon color="action" />
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Room details</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {booking.room.roomType} ({booking.persons} Guests)
                            </Typography>
                        </Box>
                    </Stack>
                  </Grid>

               
                  <Grid item xs={12} sm={6} md={4}>
                     <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                        <Chip 
                            label={booking.status.toUpperCase()} 
                            color={getStatusColor(booking.status)}
                            variant={booking.status === 'confirmed' ? 'filled' : 'outlined'}
                            sx={{ fontWeight: 'bold', minWidth: '100px' }}
                        />
                     </Box>
                  </Grid>

                </Grid>

                
                {/* <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    {booking.status === 'confirmed' && (
                        <Button variant="outlined" color="primary" size="small">
                            Download Invoice
                        </Button>
                    )}
                    {booking.status === 'pending' && (
                        <Button variant="contained" color="error" size="small">
                            Cancel Booking
                        </Button>
                    )}
                </Box> */}

              </Box>
            </Card>
          ))}
        </Stack>

      </Container>
    </Box>
  );
};

export default Bookings;