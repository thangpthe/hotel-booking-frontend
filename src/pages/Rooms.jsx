/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import PopularRooms from '../components/PopularRooms';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Box, Container, Grid, Typography } from '@mui/material';
import RoomCard from '../components/RoomCard';

const Rooms = () => {

  const [roomData,setRoomData] = useState([]);

  const fetchRooms = async () => {
    try {
      const {data} = await axios.get("/api/room/get-all");
      console.log(data);
      
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
        <Box sx={{mb: 6}}>
            <Typography variant='h3' component="h2" gutterBottom >All Rooms</Typography>
        </Box>

        <Grid container spacing={4}>
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

export default Rooms;