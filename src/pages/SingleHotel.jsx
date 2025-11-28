import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import RoomCard from '../components/RoomCard';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SingleHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/hotel/${id}`);
      
      if (data.success) {
        setHotelData(data.hotel);
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching hotel:", error);
      toast.error("Failed to load hotel details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const getAmenitiesArray = (amenities) => {
    if (Array.isArray(amenities)) {
      return amenities;
    }
    if (typeof amenities === 'string') {
      return amenities.split(',').map(item => item.trim()).filter(Boolean);
    }
    return [];
  };

  if (loading) {
    return <Loading fullScreen={false} message="Loading hotel details..." />;
  }

  if (!hotelData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <Typography variant="h5">Hotel not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        
        {/* Hotel Header */}
        <Box mb={4} borderRadius={4} boxShadow={3} p={4} sx={{ bgcolor: 'white' }}>
          <Grid container spacing={4}>
            
            {/* Hotel Image */}
            <Grid item xs={12} md={5}>
              <CardMedia
                component="img"
                image={`${backendUrl}/images/${hotelData.image}`}
                alt={hotelData.hotelName}
                sx={{
                  width: '100%',
                  height: { xs: '300px', md: '400px' },
                  objectFit: 'cover',
                  borderRadius: 3
                }}
              />
            </Grid>

            {/* Hotel Info */}
            <Grid item xs={12} md={7}>
              <Box>
                <Typography variant="h3" fontWeight="800" color="#1a202c" mb={2}>
                  {hotelData.hotelName}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <LocationOnIcon color="action" />
                  <Typography variant="h6" color="text.secondary">
                    {hotelData.hotelAddress}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    sx={{ bgcolor: '#fff8e1', px: 2, py: 1, borderRadius: 2 }}
                  >
                    <StarIcon sx={{ fontSize: 24, mr: 0.5, color: '#fbc02d' }} />
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      {hotelData.rating || 'N/A'}
                    </Typography>
                  </Stack>

                  <Box display="flex" alignItems="baseline">
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      ${hotelData.price}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" ml={0.5}>
                      / night (starting from)
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Hotel Amenities */}
                <Box>
                  <Typography variant="h5" fontWeight="bold" mb={2}>
                    Hotel Amenities
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {getAmenitiesArray(hotelData.amenities).map((amenity, index) => (
                      <Chip 
                        key={index}
                        label={amenity}
                        icon={<CheckCircleIcon />}
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Owner Info (optional) */}
                {hotelData.owner && (
                  <Box mt={3}>
                    <Typography variant="body2" color="text.secondary">
                      Managed by: <strong>{hotelData.owner.name}</strong>
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Available Rooms Section */}
        <Box mt={6}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Available Rooms ({rooms.length})
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose from our selection of comfortable rooms
            </Typography>
          </Box>

          {rooms.length > 0 ? (
            <Grid container spacing={4}>
              {rooms.map((room) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
                  <RoomCard room={room} showHotelName={false} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No rooms available at this hotel
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Please check back later or explore other hotels
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/hotels')}
              >
                Browse Other Hotels
              </Button>
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  );
};

export default SingleHotel;