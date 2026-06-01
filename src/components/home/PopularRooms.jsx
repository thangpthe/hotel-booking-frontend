/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import RoomCard from './RoomCard';
import { Box, Container, Grid, Typography } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const PopularRooms = () => {
  const [roomData,setRoomData] = useState([]);

  const fetchRooms = async () => {
    try {
      const {data} = await axios.get("/api/room/get-all");
      
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
    fetchRooms();
  },[]);
  return (
    <Box component="section" py={8} >
      <Container maxWidth="xl">
        <Box sx={{mb: 6,textAlign:'center'}}>
            <Typography variant='h3' component="h2" gutterBottom >Most Popular Rooms</Typography>
            <Typography variant='body1' color='text.secondary'>Explore our top rated rooms,loved by guests for comfort and location</Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
            {roomData.map((room) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
                  <RoomCard room={room}/>
               </Grid>
        ))}
        </Grid>

      </Container>
    </Box>
    
  )
}

export default PopularRooms;