import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from '@mui/material';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const RoomCard = ({room}) => {
  const {navigate} = useContext(AppContext);
  return (
    <Card>
      <Box sx={{position:'relative'}}>
        <CardMedia component="img" sx={{objectFit:'cover;',height:'220px'}} image={`${backendUrl}/images/${room.images[0]}`} alt={room.roomType}/>
        <Chip label={`$${room.pricePerNight} / per night`} color='primary' sx={{position:'absolute',top:16,right:16}}/>
      </Box>
      <Box>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant='h6'>
              {room.roomType}
            </Typography>
          </Box>   
        </CardContent>
      </Box>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button fullWidth variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }} onClick={() => navigate(`/rooms/${room._id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>

  )
}

export default RoomCard;