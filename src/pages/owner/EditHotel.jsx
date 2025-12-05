import React, {useEffect, useState } from 'react';
import { 
  Box, Button, Container, Grid, TextField, Typography, Paper, 
  Rating, FormControl, InputLabel, Select, MenuItem, OutlinedInput, 
  Chip, IconButton 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const AMENITIES_LIST = [
  'WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 
  'Parking', 'Room Service', 'Beach Access', 'Conference Room'
];

const EditHotel = () => {
  const { id } = useParams();
  const { navigate } = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [data, setData] = useState({
    hotelName: "",
    hotelAddress: "",
    rating: 0,
    price: "",
    amenities: [], 
    description: "" 
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const { data: res } = await axios.get(`/api/hotel/${id}`);
        
        if (res.success) {
            const hotel = res.hotel;
            setData({
                hotelName: hotel.hotelName,
                hotelAddress: hotel.hotelAddress,
                rating: Number(hotel.rating),
                price: hotel.price,
                // Chuyển chuỗi "WiFi,Pool" thành mảng ["WiFi", "Pool"] để hiển thị
                amenities: hotel.amenities ? hotel.amenities.split(',') : [], 
            });
            // Hiển thị ảnh cũ
            setImagePreview(`${backendUrl}/images/${hotel.image}`);
        } else {
            toast.error(res.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Could not fetch hotel data");
      } finally {
        setLoading(false);
      }
    };
    fetchHotelData();
  }, [id, backendUrl]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (event, newValue) => {
    setData({ ...data, rating: newValue });
  };

  const handleAmenitiesChange = (event) => {
    const { target: { value } } = event;
    setData({
      ...data,
      amenities: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("hotelName", data.hotelName);
    formData.append("hotelAddress", data.hotelAddress);
    formData.append("rating", data.rating);
    formData.append("price", data.price);
    // Chuyển mảng về chuỗi để gửi lên server (Backend bạn lưu String)
    formData.append("amenities", data.amenities.join(','));
    
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
      const { data: res } = await axios.put(`/api/hotel/update/${id}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.success) {
         toast.success('Hotel updated successfully!');
         navigate('/owner/hotels'); // Quay về danh sách
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Update failed");
      console.log(error);
    }
  }

  if (loading) return <Box p={5} textAlign="center"><Typography>Loading...</Typography></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary" mb={3}>
          Edit Hotel
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center',
                  bgcolor: '#fafafa', position: 'relative', minHeight: '200px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                }}
              >
                {imagePreview ? (
                  <Box position="relative">
                    <Box component="img" src={imagePreview} alt="Preview" sx={{ maxHeight: '300px', maxWidth: '100%', borderRadius: 2 }} />
                    <label htmlFor="upload-image-edit">
                        <Button component="span" variant="outlined" size="small" sx={{ mt: 1 }}>Change Image</Button>
                    </label>
                  </Box>
                ) : (
                  <Typography>No Image</Typography>
                )}
                <input id="upload-image-edit" type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Box>
            </Grid>

            {/* Basic Info */}
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Hotel Name" name="hotelName" value={data.hotelName} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Price per Night ($)" name="price" type="number" value={data.price} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Address" name="hotelAddress" value={data.hotelAddress} onChange={handleChange} required />
            </Grid>

            {/* Rating & Amenities */}
            <Grid item xs={12} md={6}>
              <Typography component="legend" color="text.secondary">Rating</Typography>
              <Rating name="rating" value={Number(data.rating)} onChange={handleRatingChange} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Amenities</InputLabel>
                <Select
                  multiple
                  value={data.amenities}
                  onChange={handleAmenitiesChange}
                  input={<OutlinedInput label="Amenities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => <Chip key={value} label={value} size="small" />)}
                    </Box>
                  )}
                >
                  {AMENITIES_LIST.map((name) => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5, fontSize: '1.1rem' }}>
                Update Hotel
              </Button>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditHotel;