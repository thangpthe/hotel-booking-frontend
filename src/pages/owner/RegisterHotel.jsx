import React, { useContext, useState } from 'react';
import { 
  Box, Button, Container, Grid, TextField, Typography, Paper, 
  Rating, FormControl, InputLabel, Select, MenuItem, OutlinedInput, 
  Chip, Stack, IconButton 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import HotelIcon from '@mui/icons-material/Hotel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import toast from 'react-hot-toast';
import axios from "axios";
import { AppContext } from '../../context/AppContext';

const RegisterHotel = () => {
  const [data, setData] = useState({
    hotelName: "",
    hotelAddress: "",
    rating: 0,
    price: "",
    amenities: "",

  });
  const {navigate} = useContext(AppContext);
  const handleChange = (e) => {
    setData({...data, [e.target.name]: e.target.value});
  }

  const handleRatingChange = (event, newValue) => {
    setData({...data, rating: newValue});
  }


  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(data);
    const formData = new FormData();
    formData.append("hotelName",data.hotelName);
    formData.append("hotelAddress",data.hotelAddress);
    formData.append("rating",data.rating);
    formData.append("price",data.price);
    formData.append("amenities",data.amenities);
    formData.append("image",imageFile);
    console.log(formData);
    try {
      const {data} = await axios.post("/api/hotel/register",formData,{withCredentials: true});
      if(data.success){
         toast.success('Hotel registered successfully!');
         navigate('/owner');
      }
      else{
        toast.error(data.message);
        // console.log(data.message); 
      }
    } catch (error) {
      toast.error("Failed")
      console.log("Error: ",error.message);
      
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

              {/* Left Column - Image Upload */}
              <Grid item xs={12} md={5}>
                <Box mb={2} display="flex" alignItems="center">
                  <CloudUploadIcon sx={{ mr: 1, color: 'primary.main', fontSize: { xs: 20, md: 24 } }} />
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color="text.primary"
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Hotel Image
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    border: '2px dashed #d1d5db', 
                    borderRadius: 3, 
                    p: { xs: 2, md: 3 }, 
                    textAlign: 'center',
                    bgcolor: '#fafafa',
                    position: 'relative',
                    minHeight: { xs: '200px', sm: '250px', md: '420px' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { 
                      borderColor: 'primary.main', 
                      bgcolor: '#f0f4ff',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {imagePreview ? (
                    <Box position="relative" width="100%" height="100%">
                      <Box 
                        component="img" 
                        src={imagePreview} 
                        alt="Preview" 
                        sx={{ 
                          width: '100%',
                          height: '100%',
                          maxHeight: { xs: '200px', sm: '250px', md: '420px' },
                          borderRadius: 2, 
                          objectFit: 'cover',
                          boxShadow: 1
                        }} 
                      />
                      <IconButton 
                        onClick={handleRemoveImage}
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: -8, 
                          right: -8, 
                          bgcolor: 'white', 
                          boxShadow: 2,
                          width: { xs: 32, md: 40 },
                          height: { xs: 32, md: 40 },
                          '&:hover': { bgcolor: '#fee2e2' } 
                        }}
                      >
                        <CloseIcon color="error" sx={{ fontSize: { xs: 18, md: 20 } }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <label 
                      htmlFor="upload-image" 
                      style={{ 
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '20px'
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: { xs: 50, md: 70 }, color: '#9ca3af', mb: 2 }} />
                      <Typography 
                        color="text.secondary" 
                        fontWeight="500" 
                        mb={1}
                        sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                      >
                        Click to upload or drag and drop
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                      >
                        PNG, JPG, JPEG (MAX. 5MB)
                      </Typography>
                      <input
                        id="upload-image"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </Box>
              </Grid>

              {/* Right Column - Form Fields */}
              <Grid item xs={12} md={7}>
                
                {/* Header */}
                <Box mb={3} display="flex" alignItems="center">
                  <HotelIcon sx={{ mr: 1, color: 'primary.main', fontSize: { xs: 20, md: 24 } }} />
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color="text.primary"
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Hotel Information
                  </Typography>
                </Box>

                <Stack spacing={{ xs: 2, md: 2.5 }}>
                  
                  {/* Hotel Name */}
                  <TextField
                    fullWidth
                    label="Hotel Name"
                    name="hotelName"
                    value={data.hotelName}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="Grand Plaza Hotel"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                          <HotelIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, md: 20 } }} />
                        </Box>
                      )
                    }}
                  />

                  {/* Price */}
                  <TextField
                    fullWidth
                    label="Price per Night"
                    name="price"
                    type="number"
                    value={data.price}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="100"
                    size="medium"
                    InputProps={{ 
                      startAdornment: (
                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                          <AttachMoneyIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, md: 20 } }} />
                        </Box>
                      ),
                      inputProps: { min: 0 } 
                    }}
                  />

                  {/* Address */}
                  <TextField
                    fullWidth
                    label="Address"
                    name="hotelAddress"
                    value={data.hotelAddress}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="123 Main Street, City, Country"
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'flex-start', mt: 1.5 }}>
                          <LocationOnIcon sx={{ color: 'text.secondary', fontSize: { xs: 18, md: 20 } }} />
                        </Box>
                      )
                    }}
                  />

                  {/* Star Rating */}
                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <StarIcon sx={{ mr: 0.5, color: 'warning.main', fontSize: { xs: 16, md: 18 } }} />
                      <Typography 
                        variant="body2" 
                        fontWeight="600" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}
                      >
                        Star Rating
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        p: { xs: 1.5, md: 2 },
                        border: '1px solid #e5e7eb', 
                        borderRadius: 2, 
                        bgcolor: '#fafafa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Rating
                        name="rating"
                        value={data.rating}
                        onChange={handleRatingChange}
                        size="large"
                        sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}
                      />
                    </Box>
                  </Box>

                  {/* Amenities */}
                  <TextField
                    fullWidth
                    label="Amenities"
                    name="amenities"
                    value={data.amenities}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder=""
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'flex-start', mt: 1.5 }}>
                        
                        </Box>
                      )
                    }}
                  />

                </Stack>
              </Grid>

              {/* Submit Button - Full Width */}
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
                  Register Hotel
                </Button>
              </Grid>

            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterHotel;