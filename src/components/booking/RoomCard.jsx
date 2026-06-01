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

// components/RoomCard.jsx
// import React from 'react';
// import { Card, CardMedia, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const RoomCard = ({ room, showHotelName = true }) => {
//   const navigate = useNavigate();

//   return (
//     <Card 
//       sx={{ 
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         borderRadius: 3,
//         boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//         transition: '0.3s',
//         cursor: 'pointer',
//         '&:hover': {
//           transform: 'translateY(-8px)',
//           boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
//         }
//       }}
//       onClick={() => navigate(`/room/${room._id}`)}
//     >
//       <Box sx={{ position: 'relative' }}>
//         <CardMedia
//           component="img"
//           height="200"
//           image={`${backendUrl}/images/${room.images?.[0]}`}
//           alt={room.roomType}
//           sx={{ objectFit: 'cover' }}
//         />
//         <Chip
//           icon={room.isAvailable ? <CheckCircleIcon /> : <CancelIcon />}
//           label={room.isAvailable ? "Available" : "Booked"}
//           color={room.isAvailable ? "success" : "default"}
//           sx={{ 
//             position: 'absolute', 
//             top: 12, 
//             right: 12,
//             fontWeight: 'bold'
//           }}
//         />
//       </Box>

//       <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
//         <Typography variant="h6" fontWeight="bold" gutterBottom>
//           {room.roomType}
//         </Typography>

//         {showHotelName && room.hotel && (
//           <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
//             <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//             <Typography variant="body2" color="text.secondary" noWrap>
//               {room.hotel.hotelName}
//             </Typography>
//           </Stack>
//         )}

//         <Typography variant="body2" color="text.secondary" mb={2}>
//           {room.description?.substring(0, 80)}...
//         </Typography>

//         <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
//           <Box>
//             <Typography variant="h5" fontWeight="bold" color="primary.main">
//               ${room.pricePerNight}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               per night
//             </Typography>
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default RoomCard;