import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Stack,
  Chip,
  IconButton,
  FormControlLabel,
  Switch,
  OutlinedInput
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AMENITIES_LIST = [
  'WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 
  'Parking', 'Room Service', 'Beach Access', 'Conference Room',
  'Air Conditioning', 'Pet Friendly', 'Smart TV', 'Balcony'
];

const EditRoom = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  
  const [formData, setFormData] = useState({
    roomType: '',
    hotel: '',
    pricePerNight: '',
    description: '',
    amenities: [],
    isAvailable: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const { data: roomRes } = await axios.get(`/api/room/${roomId}`);
        
        if (roomRes.success) {
          const room = roomRes.room;
          
          setFormData({
            roomType: room.roomType || '',
            hotel: room.hotel?._id || '',
            pricePerNight: room.pricePerNight || '',
            description: room.description || '',
            amenities: room.amenities ? room.amenities.split(',') : [],
            isAvailable: room.isAvailable ?? true
          });
          
          setExistingImages(room.images || []);
        } else {
          toast.error("Room not found");
          navigate('/owner/dashboard');
          return;
        }
        
        const { data: hotelRes } = await axios.get('/api/hotel/get', {
          withCredentials: true
        });
        
        if (hotelRes.success) {
          setHotels(hotelRes.hotels);
        }
        
      } catch (error) {
        console.error(error);
        toast.error('Failed to load data');
        navigate('/owner/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId, navigate]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAmenitiesChange = (event) => {
    const { target: { value } } = event;
    setFormData({
      ...formData,
      amenities: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + existingImages.length + newImages.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('roomType', formData.roomType);
      formDataToSend.append('hotel', formData.hotel);
      formDataToSend.append('pricePerNight', formData.pricePerNight);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isAvailable', formData.isAvailable);
      
      const amenitiesString = Array.isArray(formData.amenities) 
          ? formData.amenities.join(',') 
          : formData.amenities;
      formDataToSend.append('amenities', amenitiesString);

      formDataToSend.append('keepExistingImages', JSON.stringify(existingImages));
      
      newImages.forEach((image) => {
        formDataToSend.append('images', image);
      });
      
      const { data } = await axios.put(
        `/api/room/update/${roomId}`,
        formDataToSend,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      
      if (data.success) {
        toast.success('Room updated successfully!');
        navigate('/owner/rooms');
      } else {
        toast.error(data.message || 'Update failed');
      }
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to update room');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen={true} />;
  }

  return (
    <Box sx={{ py: 6, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          
          <Typography variant="h4" fontWeight="bold" gutterBottom mb={4}>
            Edit Room
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Select Hotel</InputLabel>
                  <Select
                    name="hotel"
                    value={formData.hotel}
                    onChange={handleChange}
                    label="Select Hotel"
                  >
                    {hotels.map((hotel) => (
                      <MenuItem key={hotel._id} value={hotel._id}>
                        {hotel.hotelName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Room Type"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Price Per Night ($)"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isAvailable}
                      onChange={handleChange}
                      name="isAvailable"
                      color="primary"
                    />
                  }
                  label="Room Available"
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Amenities</InputLabel>
                  <Select
                    multiple
                    value={formData.amenities}
                    onChange={handleAmenitiesChange}
                    input={<OutlinedInput label="Amenities" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {AMENITIES_LIST.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {existingImages.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Current Images</Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    {existingImages.map((img, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: 150,
                          height: 150,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '2px solid #e0e0e0'
                        }}
                      >
                        <img
                          src={`${backendUrl}/images/${img}`}
                          alt={`Room ${index}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute', top: 5, right: 5,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'white' }
                          }}
                          onClick={() => removeExistingImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Upload New Images</Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Choose Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>

                {newImagePreviews.length > 0 && (
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap mt={2}>
                    {newImagePreviews.map((preview, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: 150,
                          height: 150,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '2px solid #2196f3'
                        }}
                      >
                        <img
                          src={preview}
                          alt={`New ${index}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Chip
                          label="NEW"
                          size="small"
                          color="primary"
                          sx={{ position: 'absolute', bottom: 5, left: 5 }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute', top: 5, right: 5,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'white' }
                          }}
                          onClick={() => removeNewImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/owner/rooms')}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Update Room'}
                  </Button>
                </Stack>
              </Grid>

            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditRoom;