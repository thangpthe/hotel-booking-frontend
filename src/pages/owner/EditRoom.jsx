// pages/owner/EditRoom.jsx
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
  Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const EditRoom = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
//   const { user } = useContext(AppContext);
  
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
    amenities: '',
    isAvailable: true
  });

  // Fetch room data
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        
        // Fetch room details
        const { data: roomData } = await axios.get(`/api/room/${roomId}`);
        
        if (roomData.success) {
          const room = roomData.room;
          
          setFormData({
            roomType: room.roomType || '',
            hotel: room.hotel?._id || '',
            pricePerNight: room.pricePerNight || '',
            description: room.description || '',
            amenities: Array.isArray(room.amenities) 
              ? room.amenities.join(', ') 
              : room.amenities || '',
            isAvailable: room.isAvailable ?? true
          });
          
          setExistingImages(room.images || []);
        }
        
        // Fetch owner's hotels
        const { data: hotelsData } = await axios.get('/api/hotel/owner', {
          withCredentials: true
        });
        
        if (hotelsData.success) {
          setHotels(hotelsData.hotels);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load room data');
        navigate('/owner/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId, navigate]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + existingImages.length + newImages.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => {
      // Revoke object URL to prevent memory leak
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
      formDataToSend.append('amenities', formData.amenities);
      formDataToSend.append('isAvailable', formData.isAvailable);
      formDataToSend.append('keepExistingImages', JSON.stringify(existingImages));
      // Add new images
      newImages.forEach((image) => {
        formDataToSend.append('images', image);
      });
      
      
      console.log('📤 Submitting update...');
      
      const { data } = await axios.put(
        `/api/room/update/${roomId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );
      
      if (data.success) {
        toast.success('Room updated successfully!');
        navigate('/owner/dashboard');
      } else {
        toast.error(data.message || 'Update failed');
      }
      
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update room');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen={true} message="Loading room data..." />;
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
              
              {/* Hotel Selection */}
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

              {/* Room Type */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Room Type"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  placeholder="e.g., Deluxe Suite, Standard Room"
                />
              </Grid>

              {/* Price */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Price Per Night ($)"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              {/* Availability */}
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
                />
              </Grid>

              {/* Description */}
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
                  placeholder="Describe the room features, view, size, etc."
                />
              </Grid>

              {/* Amenities */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="e.g., WiFi, TV, Mini Bar, Balcony (comma-separated)"
                  helperText="Separate amenities with commas"
                />
              </Grid>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Current Images
                  </Typography>
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
                          alt={`Room ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
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

              {/* New Image Upload */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Upload New Images
                  </Typography>
                  
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
                            alt={`New ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <Chip
                            label="NEW"
                            size="small"
                            color="primary"
                            sx={{
                              position: 'absolute',
                              bottom: 5,
                              left: 5
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              bgcolor: 'rgba(255,255,255,0.9)',
                              '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                            }}
                            onClick={() => removeNewImage(index)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Total images: {existingImages.length + newImages.length} / 10
                  </Typography>
                </Box>
              </Grid>

              {/* Submit Buttons */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/owner/dashboard')}
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