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
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const AllRooms = () => {
  const {navigate} = useContext(AppContext);
  const [roomData,setRoomData] = useState([]);

  const fetchOwnerRooms = async () => {
    try {
      const {data} = await axios.get("/api/room/get",{ withCredentials: true });    
      if(data.success){
        setRoomData(data.rooms);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

  useEffect(() => {
    fetchOwnerRooms();
  },[]);

  const deleteRoom = async(id) => {
    try {
      const {data} = await axios.delete(`/api/room/delete/${id}`,{withCredentials: true});
       if(data.success){
        toast.success(data.message);
        fetchOwnerRooms();
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
          <h1>Your All Rooms</h1>
              <p>Manage your rooms</p>

            <Button variant='contained' onClick={() => navigate("/owner/add-room")}>
              Add Room
            </Button>
        </Box>

         <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="hotel table">
        
        <TableHead sx={{ backgroundColor: '#1976D2' }}>
          <TableRow>
            {['Hotel', 'RoomType', 'Price/ Night', 'Description', 'Available','Amenities','Action'].map((head) => (
              <TableCell key={head} sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

       
        <TableBody>
          {roomData.map((room, index) => (
            <TableRow
              key={index}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell component="th" scope="row">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CardMedia 
                    component="img" 
                    src={`${backendUrl}/images/${room.images[0]}`}
                    alt={room.roomType}
                    sx={{ 
                      width: 60,       
                      height: 60,      
                      borderRadius: 2, 
                      objectFit: 'cover' 
                    }}
                  />

                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                  {room.hotel.name}
                </Typography>
                </Stack>
                </TableCell>

             
              <TableCell sx={{ maxWidth: 200 }}>
                <Typography variant="body2" noWrap title={room.roomType}>
                  {room.roomType}
                </Typography>
              </TableCell>

            

              <TableCell>
                <Typography variant="body2" fontWeight="bold" color="error">
                  ${room.pricePerNight}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2">
                  {room.description}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip 
                  label={room.isAvailable ? "Available" : "Unavailable"} 
                  
                  size="small" 
                  variant="filled" 

                  color={room.isAvailable ? "success" : "error"} 
                  
                  sx={{ mb: 0.5, fontWeight: 'bold' }} 
                />
              </TableCell>

              <TableCell sx={{ maxWidth: 250 }}>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {room.amenities.split(",").map((item, idx) => (
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
                  <Tooltip title="Edit" onClick={() => navigate(`/edit-room/${room._id}`)}>
                    <IconButton color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" onClick={() => deleteRoom(room._id)}>
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

export default AllRooms;