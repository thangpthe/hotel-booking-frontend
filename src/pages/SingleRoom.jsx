// import React, { useEffect, useState } from 'react';
import {useParams } from 'react-router-dom';
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
import BookingForm from '../components/BookingForm';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const SingleRoom = () => {
  const { id } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
 

  // const handleChange = (e) => {
  //   setBookingData({...bookingData, [e.target.name]: e.target.value});
  // }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!bookingData.checkIn || !bookingData.checkOut) {
  //       toast.error("Please select check-in and check-out dates");
  //       return;
  //   }
    
  //   try { 
  //       const {data: checkData} = await axios.post("/api/bookings/check-availability", {
  //           room: roomData._id,
  //           checkInDate: bookingData.checkIn,
  //           checkOutDate: bookingData.checkOut
  //       });

  //       if (!checkData.success || !checkData.isAvailable) {
  //           toast.error("Room is not available for selected dates!");
  //           return;
  //       }

  //       const {data} = await axios.post("/api/bookings/book", {
  //         room: roomData._id,
  //         checkInDate: bookingData.checkIn,
  //         checkOutDate: bookingData.checkOut,
  //         persons: bookingData.persons,
  //         paymentMethod: "Pay At Hotel",
  //       });

  //       if (data.success) {
  //         toast.success(data.message);
  //         navigate("/my-bookings");
  //         window.scrollTo(0, 0);
  //       } else {
  //         toast.error(data.message);
  //       }

  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response?.data?.message || "Booking failed");
  //   }
  // }

  const getAmenityIcon = (amenity) => {
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

  const getAmenitiesArray = (amenities) => {
    if (Array.isArray(amenities)) {
      return amenities;
    }
    if (typeof amenities === 'string') {
      return amenities.split(',').map(item => item.trim()).filter(Boolean);
    }
    return [];
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoomById();
  }, [id]);



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
                <BookingForm room={roomData} />
              </Grid>

            </Grid>  
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

export default SingleRoom;