// import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// Icons - Organized imports
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';

// Amenity Icons
import PoolIcon from '@mui/icons-material/Pool';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BalconyIcon from '@mui/icons-material/Balcony';
import CoffeeIcon from '@mui/icons-material/Coffee';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import DeskIcon from '@mui/icons-material/Desk';
import PersonIcon from '@mui/icons-material/Person';
import TvIcon from '@mui/icons-material/Tv';
import SpaIcon from '@mui/icons-material/Spa';
import HotTubIcon from '@mui/icons-material/HotTub';
import KitchenIcon from '@mui/icons-material/Kitchen';
import WeekendIcon from '@mui/icons-material/Weekend';
import DeckIcon from '@mui/icons-material/Deck';
import LandscapeIcon from '@mui/icons-material/Landscape';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AcUnitIcon from '@mui/icons-material/AcUnit';

import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useEffect } from 'react';
import Loading from '../components/Loading';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const SingleRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    persons: 1
  });
  
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setBookingData({...bookingData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAvailable) {
        return checkRoomAvailability();
      } else {
        const {data} = await axios.post("/api/bookings/book", {
          room: roomData._id,
          checkInDate: bookingData.checkIn,
          checkOutDate: bookingData.checkOut,
          persons: bookingData.persons,
          paymentMethod: "Pay At Hotel",
        });
        if (data.success) {
          toast.success(data.message);
          navigate("/my-bookings");
          window.scrollTo(0, 0);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAmenityIcon = (amenity) => {
    // Normalize amenity string - trim and lowercase for comparison
    const normalizedAmenity = amenity.trim().toLowerCase();
    
    const iconMap = {
      "ocean view": <VisibilityIcon />,
      "mountain view": <LandscapeIcon />,
      "garden view": <LandscapeIcon />,
      "balcony": <BalconyIcon />,
      "mini bar": <CoffeeIcon />,
      "room service": <RoomServiceIcon />,
      "free wifi": <WifiIcon />,
      "wifi": <WifiIcon />,
      "work desk": <DeskIcon />,
      "concierge service": <PersonIcon />,
      "breakfast included": <RestaurantIcon />,
      "breakfast": <RestaurantIcon />,
      "parking": <LocalParkingIcon />,
      "smart tv": <TvIcon />,
      "tv": <TvIcon />,
      "spa access": <SpaIcon />,
      "spa": <SpaIcon />,
      "pool access": <PoolIcon />,
      "pool": <PoolIcon />,
      "kitchen": <KitchenIcon />,
      "living area": <WeekendIcon />,
      "private terrace": <DeckIcon />,
      "terrace": <DeckIcon />,
      "butler service": <PersonIcon />,
      "jacuzzi": <HotTubIcon />,
      "panoramic view": <VisibilityIcon />,
      "air conditioning": <AcUnitIcon />,
      "ac": <AcUnitIcon />
    };
    
    return iconMap[normalizedAmenity] || <CheckCircleIcon />;
  };

  const fetchRoomById = async () => {
    try {
      const { data } = await axios.get(`/api/room/${id}`);
      
      if (data.success) {
        setRoomData(data.room);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load room details");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoomById();
  }, [id]);

  const checkRoomAvailability = async () => {
    try {
      if (bookingData.checkIn >= bookingData.checkOut) {
        toast.error('Check in date must be before check out date');
        return;
      }
      const {data} = await axios.post("/api/bookings/check-availability", {
        room: roomData._id,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut
      });
      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success("Room is available");
        } else {
          setIsAvailable(false);
          toast.error("Room is not available");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Helper function to parse amenities
  const getAmenitiesArray = (amenities) => {
    if (Array.isArray(amenities)) {
      return amenities;
    }
    if (typeof amenities === 'string') {
      return amenities.split(',').map(item => item.trim()).filter(Boolean);
    }
    return [];
  };

  // Loading state
  if (!roomData) {
      return <Loading fullScreen={false} message="Loading room details..." />;
  }
  
  return (
    <Box sx={{ py: 4, bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          
          <Grid item xs={12} md={7} lg={8}>
            
            {/* Room Header */}
            <Box mb={3} borderRadius={4} boxShadow={2} p={3} sx={{ bgcolor: 'background.paper' }}>
              <Grid container spacing={3} justifyContent="space-between">
                
                <Grid item xs={12} md={8}>
                  <Box>
                    <Typography variant="h3" fontWeight="800" color="#1a202c" mb={1} sx={{ fontSize: { xs: '1.8rem', md: '3rem' } }}>
                      {roomData.roomType}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                      <LocationOnIcon color="action" />
                      <Typography variant="body1" color="text.secondary">
                        {roomData.hotel?.hotelAddress}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Stack direction="row" alignItems="center" sx={{ bgcolor: '#fff8e1', px: 1, py: 0.5, borderRadius: 1 }}>
                        <StarIcon sx={{ fontSize: 20, mr: 0.5, color: '#fbc02d' }} />
                        <Typography variant="body1" fontWeight="bold" color="text.primary">
                          {roomData.hotel?.rating || 'N/A'}
                        </Typography>
                      </Stack>

                      <Chip
                        icon={roomData.isAvailable ? <CheckCircleIcon /> : <CancelIcon />}
                        label={roomData.isAvailable ? "Available" : "Booked"}
                        color={roomData.isAvailable ? "success" : "default"}
                        variant="filled"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: { xs: 'flex-start', md: 'flex-end' }, 
                    justifyContent: 'center',
                    height: '100%'
                  }}>
                    <Box display="flex" alignItems="baseline" mb={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        ${roomData.pricePerNight}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" ml={0.5}>
                        / night
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

              </Grid>
            </Box>
            
            {/* Room Gallery */}
            <Box borderRadius={4} boxShadow={2} overflow="hidden" p={{ xs: 1, md: 2 }}>
              <Box p={{ xs: 1, md: 2 }} ml={{ xs: 0, md: 2 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', md: '2.125rem' } }}>
                  Room Gallery
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, p: { xs: 1, md: 2 }, flexDirection: { xs: 'column', md: 'row' } }}>
                
                {/* Main Image */}
                <Box sx={{ 
                  flex: { xs: '1', md: '3' }, 
                  height: { xs: '250px', sm: '350px', md: '500px' }
                }}>
                  <Box
                    component="img"
                    src={`${backendUrl}/images/${roomData.images?.[selectedImage]}`}
                    alt="Main Room Image"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: '0.3s',
                      '&:hover': { opacity: 0.95 }
                    }}
                  />
                </Box>

                {/* Thumbnails */}
                <Box sx={{ 
                  flex: '1',
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  gap: 1,
                  overflowX: { xs: 'auto', md: 'visible' },
                  overflowY: { xs: 'visible', md: 'auto' },
                  maxHeight: { xs: '100px', md: '500px' },
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}>
                  {roomData.images?.map((img, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={`${backendUrl}/images/${img}`}
                      sx={{
                        width: { xs: '80px', sm: '100px', md: '100%' },
                        height: { xs: '80px', sm: '100px', md: '23%' },
                        minWidth: { xs: '80px', sm: '100px', md: 'auto' },
                        objectFit: 'cover',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: '0.3s',
                        border: selectedImage === index ? '3px solid #2563eb' : '3px solid transparent',
                        '&:hover': { 
                          opacity: 0.8,
                          border: '3px solid #2563eb'
                        }
                      }}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Description */}
            <Box mb={4} mt={4} p={{ xs: 1, md: 2 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>About This Room</Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                {roomData.description}
              </Typography>
            </Box>
            
            {/* Amenities Section */}
            <Grid container spacing={3} justifyContent="space-between">
              
              <Grid item xs={12} md={8}>
                
                {/* Room Amenities */}
                <Box mt={4} mb={4} boxShadow={2} borderRadius={4} p={3}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>Room Amenities</Typography>
                  <Grid container spacing={2} mt={1}>
                    {getAmenitiesArray(roomData.amenities).map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}> 
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box sx={{ color: 'primary.main' }}>
                            {getAmenityIcon(item)}
                          </Box>
                          <Typography variant="body1">{item}</Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Hotel Amenities */}
                <Box mt={4} mb={4} borderRadius={4} boxShadow={2} p={3}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>Hotel Amenities</Typography>
                  <Grid container spacing={2} mt={1}>
                    {getAmenitiesArray(roomData.hotel?.amenities).map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box sx={{ color: 'primary.main' }}>
                            {getAmenityIcon(item)}
                          </Box>
                          <Typography variant="body1">{item}</Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

              </Grid>

              {/* Booking Form */}
              <Grid item xs={12} md={4} lg={12} sx={{
                '@media (max-width: 768px)': { width: '100%' },
                '@media (min-width: 1024px)': { width: '33.3%' },
              }}>
                <Box 
                  mt={4} 
                  mb={4} 
                  borderRadius={4} 
                  boxShadow={3} 
                  p={3} 
                  sx={{ bgcolor: 'background.paper', position: 'sticky', top: 20 }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom mb={3}>
                    Book This Room
                  </Typography>
                  
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}> 
                      
                      <TextField 
                        label="Check in Date"
                        type='date' 
                        value={bookingData.checkIn} 
                        name='checkIn' 
                        onChange={handleChange}
                        inputProps={{ min: today }}
                        InputLabelProps={{ shrink: true }} 
                        fullWidth
                      />

                      <TextField 
                        label="Check out Date"
                        type='date' 
                        value={bookingData.checkOut} 
                        name='checkOut' 
                        inputProps={{ min: bookingData.checkIn || today }}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />

                      <TextField 
                        label="Number of Person"
                        type='number' 
                        value={bookingData.persons} 
                        name='persons' 
                        onChange={handleChange}
                        InputProps={{ inputProps: { min: 1 } }}
                        fullWidth
                      />

                      <Grid container justifyContent={'space-between'}>
                        <Typography variant='h6'>Price</Typography>
                        <Typography color='primary.main' variant='h6'>
                          ${roomData.pricePerNight} /night
                        </Typography>
                      </Grid>
                      
                      <Button 
                        variant="contained" 
                        type="submit" 
                        fullWidth 
                        size="large" 
                        sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
                      > 
                        {isAvailable ? "Book Now" : "Check Availability"}
                      </Button>
                    </Stack>
                  </form>
                </Box>
              </Grid>

            </Grid>  
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

export default SingleRoom;