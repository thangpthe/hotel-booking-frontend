/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { 
  Box, Button, Container, Grid, TextField, Typography, Paper, 
  FormControl, InputLabel, Select, MenuItem, IconButton 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import HotelIcon from '@mui/icons-material/Hotel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import toast from 'react-hot-toast';
import axios from "axios";
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const AddRoom = () => {
  const {navigate} = useContext(AppContext);
  const [roomData, setRoomData] = useState({
    hotel: "",
    roomType: "",
    pricePerNight: "",
    description: "",
    images: [],
    amenities: "",
    isAvailable: true,
  });

  const [hotelData, setHotelData] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
  
  const fetchOwnerHotels = async () => {
    try {
      const {data} = await axios.get("/api/hotel/get");
      console.log(data);
      
      if(data.success){
        setHotelData(data.hotels);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOwnerHotels();
  },[]);

  const handleChange = (e) => {
    setRoomData({...roomData, [e.target.name]: e.target.value});
  }

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Update images array
      const updatedImages = [...roomData.images];
      updatedImages[index] = file;
      setRoomData({...roomData, images: updatedImages});

      // Update preview
      const updatedPreviews = [...imagePreviews];
      updatedPreviews[index] = URL.createObjectURL(file);
      setImagePreviews(updatedPreviews);
    }
  };

  const handleRemoveImage = (index) => {
    // Remove from images array
    const updatedImages = [...roomData.images];
    updatedImages.splice(index, 1);
    setRoomData({...roomData, images: updatedImages});

    // Remove preview
    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index] = null;
    setImagePreviews(updatedPreviews);
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Validate that at least one image is uploaded
    if (roomData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("hotel", roomData.hotel);
    formData.append("roomType", roomData.roomType);
    formData.append("pricePerNight", roomData.pricePerNight);
    formData.append("description", roomData.description);
    formData.append("isAvailable", roomData.isAvailable);
    formData.append("amenities", roomData.amenities);

    // Append all images
    roomData.images.forEach((image) => {
      if (image) {
        formData.append("images", image);
      }
    });

    console.log("Room Data:", roomData);
    console.log("Images count:", roomData.images.length);
    
    try {
      const {data} = await axios.post("/api/room/add", formData, {
        headers: {
          'Content-Type': "multipart/form-data",
        }
      });
      if(data.success){
        toast.success(data.message);
        navigate('/owner/rooms');
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add room");
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: { xs: 3, md: 5 }
    }}>
      <Container maxWidth="lg">
        
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: 4, 
            bgcolor: 'white',
            maxWidth: '1100px',
            mx: 'auto'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2, md: 3 }}>

              {/* Image Upload Section */}
              <Grid item xs={12}>
                <Box mb={2} display="flex" alignItems="center">
                  <CloudUploadIcon sx={{ mr: 1, color: 'primary.main', fontSize: { xs: 20, md: 24 } }} />
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color="text.primary"
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Room Images (Upload up to 4 images)
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {[0, 1, 2, 3].map((index) => (
                    <Grid item xs={6} sm={6} md={3} key={index}>
                      <Box 
                        sx={{ 
                          border: '2px dashed #d1d5db', 
                          borderRadius: 2, 
                          p: 2, 
                          textAlign: 'center',
                          bgcolor: '#fafafa',
                          position: 'relative',
                          height: { xs: '150px', md: '180px' },
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          '&:hover': { 
                            borderColor: 'primary.main', 
                            bgcolor: '#f0f4ff',
                          }
                        }}
                      >
                        {imagePreviews[index] ? (
                          <Box position="relative" width="100%" height="100%">
                            <Box 
                              component="img" 
                              src={imagePreviews[index]} 
                              alt={`Preview ${index + 1}`} 
                              sx={{ 
                                width: '100%',
                                height: '100%',
                                borderRadius: 1, 
                                objectFit: 'cover',
                              }} 
                            />
                            <IconButton 
                              onClick={() => handleRemoveImage(index)}
                              size="small"
                              sx={{ 
                                position: 'absolute', 
                                top: -8, 
                                right: -8, 
                                bgcolor: 'white', 
                                boxShadow: 2,
                                width: 28,
                                height: 28,
                                '&:hover': { bgcolor: '#fee2e2' } 
                              }}
                            >
                              <CloseIcon color="error" sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        ) : (
                          <label 
                            htmlFor={`upload-image-${index}`}
                            style={{ 
                              width: '100%',
                              height: '100%',
                              cursor: 'pointer', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                            }}
                          >
                            <CloudUploadIcon sx={{ fontSize: 40, color: '#9ca3af', mb: 1 }} />
                            <Typography 
                              color="text.secondary" 
                              variant="caption"
                              sx={{ fontSize: '0.7rem' }}
                            >
                              Image {index + 1}
                            </Typography>
                            <input
                              id={`upload-image-${index}`}
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => handleImageChange(e, index)}
                            />
                          </label>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12}>
                <Box mb={3} display="flex" alignItems="center">
                  <HotelIcon sx={{ mr: 1, color: 'primary.main', fontSize: { xs: 20, md: 24 } }} />
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color="text.primary"
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Room Information
                  </Typography>
                </Box>

                <Grid container spacing={2.5}>
                  
                  {/* Select Hotel */}
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="select-hotel-label">Select Hotel</InputLabel>
                      <Select
                        labelId="select-hotel-label"
                        value={roomData.hotel}
                        name='hotel'
                        label="Select Hotel"
                        onChange={handleChange}
                      >
                        {hotelData.map((item) => (
                          <MenuItem key={item._id} value={item._id}>{item.hotelName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Room Type */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Room Type"
                      name="roomType"
                      value={roomData.roomType}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="Deluxe Suite"
                    />
                  </Grid>

                  {/* Price */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Price Per Night"
                      name="pricePerNight"
                      type="number"
                      value={roomData.pricePerNight}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="100"
                      InputProps={{ 
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            <AttachMoneyIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </Box>
                        ),
                        inputProps: { min: 0 } 
                      }}
                    />
                  </Grid>

                  {/* Description */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={roomData.description}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="Describe the room..."
                      multiline
                      rows={3}
                    />
                  </Grid>

                  {/* Amenities */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Room Amenities"
                      name="amenities"
                      value={roomData.amenities}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="WiFi, TV, Air Conditioning..."
                      multiline
                      rows={2}
                    />
                  </Grid>

                  {/* Is Available Checkbox */}
                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        border: '1px solid #e5e7eb', 
                        borderRadius: 2, 
                        bgcolor: '#fafafa',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <input
                        type="checkbox"
                        id="isAvailable"
                        name="isAvailable"
                        checked={roomData.isAvailable}
                        onChange={(e) => setRoomData({...roomData, isAvailable: e.target.checked})}
                        style={{
                          width: '20px',
                          height: '20px',
                          marginRight: '12px',
                          cursor: 'pointer',
                          accentColor: '#667eea'
                        }}
                      />
                      <label 
                        htmlFor="isAvailable" 
                        style={{ 
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 500,
                          color: '#374151',
                          userSelect: 'none'
                        }}
                      >
                        Room is available for booking
                      </label>
                    </Box>
                  </Grid>

                </Grid>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  sx={{ 
                    py: { xs: 1.3, md: 1.8 }, 
                    fontSize: { xs: '0.95rem', md: '1.1rem' }, 
                    fontWeight: 'bold', 
                    borderRadius: 2,
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    }
                  }}
                >
                  Add Room
                </Button>
              </Grid>

            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddRoom;