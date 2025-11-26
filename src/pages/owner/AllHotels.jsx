/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Box, Button, CardMedia, Paper, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { 
  Typography, Chip, Stack, IconButton, Tooltip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import axios from 'axios';
import toast from 'react-hot-toast';
const AllHotels = () => {
  const {navigate} = useContext(AppContext);
  const [hotelData,setHotelData] =useState([]);
  const fetchOwnerHotels = async () => {
    try {
      const {data} = await axios.get("/api/hotel/get");
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
  },[hotelData]);
  

  const deleteHotel = async(id) => {
    try {
      const {data} = await axios.delete(`/api/hotel/delete/${id}`);
       if(data.success){
        toast.success(data.message);
        fetchOwnerHotels();
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);  
    }
  }
  return (
    <div>
        <Box mb={8}>
          <h1>Premium Hotels Collection</h1>
              <p>Discover exceptional stays around the world</p>

            <Button variant='contained' onClick={() => navigate("/owner/register-hotel")}>
              Register Hotel
            </Button>
        </Box>

         <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="hotel table">
        
       
        <TableHead sx={{ backgroundColor: '#1976D2' }}>
          <TableRow>
            {['Hotel', 'Location', 'Contact', 'Rating', 'Price/Night', 'Amenities', 'Action'].map((head) => (
              <TableCell key={head} sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

       
        <TableBody>
          {hotelData.map((hotel, index) => (
            <TableRow
              key={index}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell component="th" scope="row">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CardMedia 
                    component="img" 
                    src={`http://localhost:4000/images/${hotel.image}`}
                    alt={hotel.hotelName}
                    sx={{ 
                      width: 60,       
                      height: 60,      
                      borderRadius: 2, 
                      objectFit: 'cover' 
                    }}
                  />

                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                  {hotel.hotelName}
                </Typography>
                </Stack>
                </TableCell>

             
              <TableCell sx={{ maxWidth: 200 }}>
                <Typography variant="body2" noWrap title={hotel.address}>
                  {hotel.hotelAddress}
                </Typography>
              </TableCell>

              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <PhoneIcon fontSize="small" color="action"/>
                    <Typography variant="body2">+924782375</Typography>
                </Stack>
              </TableCell>

            
              <TableCell>
                <Box display="flex" alignItems="center" bgcolor="#fff8e1" px={1} py={0.5} borderRadius={1} width="fit-content">
                  <StarIcon sx={{ color: '#fbc02d', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" fontWeight="bold">{hotel.rating}</Typography>
                </Box>
              </TableCell>

              
              <TableCell>
                <Typography variant="body2" fontWeight="bold" color="error">
                  {hotel.price}
                </Typography>
              </TableCell>

              
              <TableCell sx={{ maxWidth: 250 }}>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {hotel.amenities.split(",").map((item, idx) => (
                    <Chip 
                      key={idx} 
                      label={item} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                      sx={{ mb: 0.5 }} 
                    />
                  ))}
                </Stack>
              </TableCell>

              
              <TableCell>
                <Stack direction="row">
                  <Tooltip title="Delete" onClick={ () => deleteHotel(hotel._id)}>
                    <IconButton color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </div>
  )
}

export default AllHotels;