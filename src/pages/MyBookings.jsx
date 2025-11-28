/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Card, CardMedia, Grid, Chip, Stack, Button, Divider
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const MyBookings = () => {
  const [bookingData, setBookingData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fetchMyBookings = async () => {
    try {
      const {data} = await axios.get("/api/bookings/user",{withCredentials:true});
      // console.log(data);
      
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

  const handlePayment = async (bookingId) => {
    setIsProcessing(true);
    try {
      const {data} = await axios.post("/api/bookings/stripe-payment",{
        bookingId,
      },{withCredentials:true});
      if(data.success){
        window.location.href = data.url;
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      setIsProcessing(false);
      console.log(error);     
    }
  }

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case "confirmed": return "success";
      case "pending": return "warning";  
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };


  return (
    <Box sx={{ py: 6, bgcolor: '#fafafa', minHeight: '100vh' }}>
      {isProcessing && <Loading fullScreen={true} message="Processing secure payment..." />}
      <Container maxWidth="xl">
        
        <Typography variant="h4" fontWeight="bold" gutterBottom mb={4}>
          My Bookings
        </Typography>

        {/* Table Header */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1.5fr 1fr 0.5fr' },
            gap: 2,
            mb: 2,
            px: 2
          }}
        >
          <Typography variant="body2" fontWeight="600" color="text.secondary">
            Hotel & Room
          </Typography>
          <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            Dates
          </Typography>
          <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            Payment
          </Typography>
          <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            Actions
          </Typography>
        </Box>

        {/* Bookings List */}
        <Stack spacing={2}>
          {bookingData.map((booking) => (
            <Card 
              key={booking._id} 
              sx={{ 
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: '0.2s',
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }
              }}
            >
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '2fr 1.5fr 1fr 0.5fr' },
                  gap: 2,
                  p: 3,
                  alignItems: 'center'
                }}
              >
                
                {/* Hotel & Room Info */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: 2, 
                      objectFit: 'cover' 
                    }}
                    image={`${backendUrl}/images/${booking.room.images[0]}`} 
                    alt={booking.hotel.hotelName}
                  />
                  
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="#1a202c">
                      {booking.hotel.hotelName}
                    </Typography>
                    <Typography variant="body2" color="primary.main" fontWeight="500">
                      {booking.room.roomType}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                      <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {booking.hotel.hotelAddress}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5} mt={0.3}>
                      <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {booking.persons} {booking.persons > 1 ? 'Guests' : 'Guest'}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                {/* Dates */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Check-in
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {formatDate(booking.checkIn)}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Check-out
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {formatDate(booking.checkOut)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Box>

                {/* Payment */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <PaymentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {booking.paymentMethod}
                    </Typography>
                  </Stack>
                  
                  <Typography variant="h5" fontWeight="bold" color="#1a202c" mb={1}>
                    ${booking.totalPrice}
                  </Typography>
                  
                  {!booking.isPaid && (
                    <Button 
                      variant="contained" 
                      size="small"
                      fullWidth
                      onClick={() => handlePayment(booking._id)}
                      sx={{ 
                        bgcolor: '#ef4444',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#dc2626' }
                      }}
                    >
                      Pay Now
                    </Button>
                  )}
                </Box>

                {/* Status */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                  <Chip 
                    label={booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)} 
                    color={getStatusColor(booking.status)}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                {/* Mobile View - Bottom Info */}
                <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Check-in
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {formatDate(booking.checkIn)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Check-out
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {formatDate(booking.checkOut)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Payment
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        ${booking.totalPrice}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.paymentMethod}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Chip 
                        label={booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)} 
                        color={getStatusColor(booking.status)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                      
                      {!booking.isPaid && (
                        <Button 
                          variant="contained" 
                          size="small"
                          fullWidth
                          onClick={() => handlePayment(booking._id)}
                          sx={{ 
                            mt: 1,
                            bgcolor: '#ef4444',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 600,
                            cursor:'pointer',
                            '&:hover': { bgcolor: '#dc2626' }
                          }}
                        >
                          Pay Now
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Box>

              </Box>
            </Card>
          ))}

          {/* Empty State */}
          {bookingData.length === 0 && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No bookings found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start exploring and book your perfect room!
              </Typography>
            </Box>
          )}
        </Stack>

      </Container>
    </Box>
  );
};

export default MyBookings;