// /* eslint-disable react-hooks/immutability */
// /* eslint-disable react-hooks/set-state-in-effect */
// import React, { useEffect, useState } from 'react';
// import { 
//   Box, Container, Typography, Card, CardMedia, Grid, Chip, Stack, Button, Divider
// } from '@mui/material';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import PeopleIcon from '@mui/icons-material/People';
// import PaymentIcon from '@mui/icons-material/Payment';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Loading from '../components/Loading';
// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// const MyBookings = () => {
//   const [bookingData, setBookingData] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const fetchMyBookings = async () => {
//     try {
//       const {data} = await axios.get("/api/bookings/user",{withCredentials:true});
//       // console.log(data);
      
//       if(data.success){
//         setBookingData(data.bookings);
//       }
//       else{
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const handlePayment = async (bookingId) => {
//     setIsProcessing(true);
//     try {
//       const {data} = await axios.post("/api/bookings/stripe-payment",{
//         bookingId,
//       },{withCredentials:true});
//       if(data.success){
//         window.location.href = data.url;
//       }
//       else{
//         toast.error(data.message);
//       }
//     } catch (error) {
//       setIsProcessing(false);
//       console.log(error);     
//     }
//   }

//   useEffect(() => {
//     fetchMyBookings();
//   }, []);

//   const getStatusColor = (status) => {
//     const statusLower = status?.toLowerCase();
//     switch(statusLower) {
//       case "confirmed": return "success";
//       case "pending": return "warning";  
//       case "cancelled": return "error";
//       default: return "default";
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     const options = { weekday: 'short', month: 'short', day: 'numeric' };
//     return date.toLocaleDateString('en-US', options);
//   };


//   return (
//     <Box sx={{ py: 6, bgcolor: '#fafafa', minHeight: '100vh' }}>
//       {isProcessing && <Loading fullScreen={true} message="Processing secure payment..." />}
//       <Container maxWidth="xl">
        
//         <Typography variant="h4" fontWeight="bold" gutterBottom mb={4}>
//           My Bookings
//         </Typography>

//         {/* Table Header */}
//         <Box 
//           sx={{ 
//             display: 'grid',
//             gridTemplateColumns: { xs: '1fr', md: '2fr 1.5fr 1fr 0.5fr' },
//             gap: 2,
//             mb: 2,
//             px: 2
//           }}
//         >
//           <Typography variant="body2" fontWeight="600" color="text.secondary">
//             Hotel & Room
//           </Typography>
//           <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
//             Dates
//           </Typography>
//           <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
//             Payment
//           </Typography>
//           <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
//             Actions
//           </Typography>
//         </Box>

//         {/* Bookings List */}
//         <Stack spacing={2}>
//           {bookingData.map((booking) => (
//             <Card 
//               key={booking._id} 
//               sx={{ 
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
//                 transition: '0.2s',
//                 '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }
//               }}
//             >
//               <Box 
//                 sx={{ 
//                   display: 'grid',
//                   gridTemplateColumns: { xs: '1fr', md: '2fr 1.5fr 1fr 0.5fr' },
//                   gap: 2,
//                   p: 3,
//                   alignItems: 'center'
//                 }}
//               >
                
//                 {/* Hotel & Room Info */}
//                 <Stack direction="row" spacing={2} alignItems="center">
//                   <CardMedia
//                     component="img"
//                     sx={{ 
//                       width: 80, 
//                       height: 80, 
//                       borderRadius: 2, 
//                       objectFit: 'cover' 
//                     }}
//                     image={`${backendUrl}/images/${booking.room.images[0]}`} 
//                     alt={booking.hotel.hotelName}
//                   />
                  
//                   <Box>
//                     <Typography variant="h6" fontWeight="bold" color="#1a202c">
//                       {booking.hotel.hotelName}
//                     </Typography>
//                     <Typography variant="body2" color="primary.main" fontWeight="500">
//                       {booking.room.roomType}
//                     </Typography>
//                     <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
//                       <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
//                       <Typography variant="caption" color="text.secondary">
//                         {booking.hotel.hotelAddress}
//                       </Typography>
//                     </Stack>
//                     <Stack direction="row" alignItems="center" spacing={0.5} mt={0.3}>
//                       <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
//                       <Typography variant="caption" color="text.secondary">
//                         {booking.persons} {booking.persons > 1 ? 'Guests' : 'Guest'}
//                       </Typography>
//                     </Stack>
//                   </Box>
//                 </Stack>

//                 {/* Dates */}
//                 <Box sx={{ display: { xs: 'none', md: 'block' } }}>
//                   <Stack spacing={1}>
//                     <Stack direction="row" spacing={1} alignItems="center">
//                       <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//                       <Box>
//                         <Typography variant="caption" color="text.secondary" display="block">
//                           Check-in
//                         </Typography>
//                         <Typography variant="body2" fontWeight="600">
//                           {formatDate(booking.checkIn)}
//                         </Typography>
//                       </Box>
//                     </Stack>
                    
//                     <Stack direction="row" spacing={1} alignItems="center">
//                       <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//                       <Box>
//                         <Typography variant="caption" color="text.secondary" display="block">
//                           Check-out
//                         </Typography>
//                         <Typography variant="body2" fontWeight="600">
//                           {formatDate(booking.checkOut)}
//                         </Typography>
//                       </Box>
//                     </Stack>
//                   </Stack>
//                 </Box>

//                 {/* Payment */}
//                 <Box sx={{ display: { xs: 'none', md: 'block' } }}>
//                   <Stack direction="row" spacing={1} alignItems="center" mb={1}>
//                     <PaymentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//                     <Typography variant="caption" color="text.secondary">
//                       {booking.paymentMethod}
//                     </Typography>
//                   </Stack>
                  
//                   <Typography variant="h5" fontWeight="bold" color="#1a202c" mb={1}>
//                     ${booking.totalPrice}
//                   </Typography>
                  
//                   {!booking.isPaid && (
//                     <Button 
//                       variant="contained" 
//                       size="small"
//                       fullWidth
//                       onClick={() => handlePayment(booking._id)}
//                       sx={{ 
//                         bgcolor: '#ef4444',
//                         color: 'white',
//                         textTransform: 'none',
//                         fontWeight: 600,
//                         '&:hover': { bgcolor: '#dc2626' }
//                       }}
//                     >
//                       Pay Now
//                     </Button>
//                   )}
//                 </Box>

//                 {/* Status */}
//                 <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
//                   <Chip 
//                     label={booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)} 
//                     color={getStatusColor(booking.status)}
//                     size="small"
//                     sx={{ fontWeight: 'bold' }}
//                   />
//                 </Box>

//                 {/* Mobile View - Bottom Info */}
//                 <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2 }}>
//                   <Divider sx={{ mb: 2 }} />
                  
//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <Typography variant="caption" color="text.secondary" display="block">
//                         Check-in
//                       </Typography>
//                       <Typography variant="body2" fontWeight="600">
//                         {formatDate(booking.checkIn)}
//                       </Typography>
//                     </Grid>
                    
//                     <Grid item xs={6}>
//                       <Typography variant="caption" color="text.secondary" display="block">
//                         Check-out
//                       </Typography>
//                       <Typography variant="body2" fontWeight="600">
//                         {formatDate(booking.checkOut)}
//                       </Typography>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <Typography variant="caption" color="text.secondary" display="block">
//                         Payment
//                       </Typography>
//                       <Typography variant="body2" fontWeight="600">
//                         ${booking.totalPrice}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {booking.paymentMethod}
//                       </Typography>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <Chip 
//                         label={booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)} 
//                         color={getStatusColor(booking.status)}
//                         size="small"
//                         sx={{ fontWeight: 'bold' }}
//                       />
                      
//                       {!booking.isPaid && (
//                         <Button 
//                           variant="contained" 
//                           size="small"
//                           fullWidth
//                           onClick={() => handlePayment(booking._id)}
//                           sx={{ 
//                             mt: 1,
//                             bgcolor: '#ef4444',
//                             color: 'white',
//                             textTransform: 'none',
//                             fontWeight: 600,
//                             cursor:'pointer',
//                             '&:hover': { bgcolor: '#dc2626' }
//                           }}
//                         >
//                           Pay Now
//                         </Button>
//                       )}
//                     </Grid>
//                   </Grid>
//                 </Box>

//               </Box>
//             </Card>
//           ))}

//           {/* Empty State */}
//           {bookingData.length === 0 && (
//             <Box 
//               sx={{ 
//                 textAlign: 'center', 
//                 py: 8,
//                 bgcolor: 'white',
//                 borderRadius: 2,
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
//               }}
//             >
//               <Typography variant="h6" color="text.secondary" gutterBottom>
//                 No bookings found
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Start exploring and book your perfect room!
//               </Typography>
//             </Box>
//           )}
//         </Stack>

//       </Container>
//     </Box>
//   );
// };

// export default MyBookings;

import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Card, CardMedia, Grid, Chip, Stack, Button, 
  Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MyBookings = () => {
  const [bookingData, setBookingData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    checkIn: '',
    checkOut: '',
    persons: 1
  });

  const today = new Date().toISOString().split('T')[0];

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user",{withCredentials:true});
      
      if (data.success) {
        setBookingData(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      toast.error("Failed to load bookings");
    }
  };

  const handlePayment = async (bookingId) => {
    setIsProcessing(true);
    try {
      const { data } = await axios.post("/api/bookings/stripe-payment", {
        bookingId
      });
      
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      checkIn: new Date(booking.checkIn).toISOString().split('T')[0],
      checkOut: new Date(booking.checkOut).toISOString().split('T')[0],
      persons: booking.persons
    });
    setEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      const { data } = await axios.put(
        `/api/bookings/update/${selectedBooking._id}`,
        {
          checkInDate: editForm.checkIn,
          checkOutDate: editForm.checkOut,
          persons: editForm.persons
        }
      );

      if (data.success) {
        toast.success("Booking updated successfully!");
        setEditDialog(false);
        fetchMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || "Failed to update booking");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const { data } = await axios.delete(`/api/bookings/cancel/${bookingId}`);

      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case "confirmed": return "success";
      case "pending": return "warning";  
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const canEditBooking = (booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const hoursDiff = (checkIn - now) / (1000 * 60 * 60);
    
    return !booking.isPaid && 
           booking.status.toLowerCase() !== 'cancelled' && 
           hoursDiff > 24;
  };

  const canCancelBooking = (booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    // Cannot cancel if already checked in
    if (now >= checkIn && now < checkOut) return false;
    
    // Cannot cancel if check-in is within 24 hours
    const hoursDiff = (checkIn - now) / (1000 * 60 * 60);
    if (hoursDiff < 24 && hoursDiff > 0) return false;
    
    return booking.status.toLowerCase() !== 'cancelled';
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#fafafa', minHeight: '100vh' }}>
      {isProcessing && <Loading fullScreen={true} message="Processing secure payment..." />}
      
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight="bold" gutterBottom mb={4}>
          My Bookings
        </Typography>

        {/* Bookings List */}
        <Stack spacing={2}>
          {bookingData.map((booking) => (
            <Card 
              key={booking._id} 
              sx={{ 
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: '0.2s',
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }
              }}
            >
              <Box sx={{ p: 3 }}>
                
                {/* Desktop View */}
                <Grid container spacing={3} alignItems="center">
                  
                  {/* Hotel & Room Info */}
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CardMedia
                        component="img"
                        sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover' }}
                        image={`${backendUrl}/images/${booking.room.images[0]}`} 
                        alt={booking.hotel.hotelName}
                      />
                      
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color="#1a202c">
                          {booking.hotel.hotelName}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="500">
                          {booking.room.roomType}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                          <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {booking.persons} {booking.persons > 1 ? 'Guests' : 'Guest'}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Dates */}
                  <Grid item xs={12} md={3}>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">Check-in</Typography>
                          <Typography variant="body2" fontWeight="600">{formatDate(booking.checkIn)}</Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">Check-out</Typography>
                          <Typography variant="body2" fontWeight="600">{formatDate(booking.checkOut)}</Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* Payment & Status */}
                  <Grid item xs={12} md={2}>
                    <Typography variant="h5" fontWeight="bold" color="#1a202c" mb={1}>
                      ${booking.totalPrice}
                    </Typography>
                    <Chip 
                      label={booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)} 
                      color={getStatusColor(booking.status)}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12} md={3}>
                    <Stack spacing={1}>
                      {!booking.isPaid && booking.status.toLowerCase() !== 'cancelled' && (
                        <Button 
                          variant="contained" 
                          size="small"
                          fullWidth
                          onClick={() => handlePayment(booking._id)}
                          sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
                        >
                          Pay Now
                        </Button>
                      )}
                      
                      {canEditBooking(booking) && (
                        <Button 
                          variant="outlined" 
                          size="small"
                          fullWidth
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(booking)}
                        >
                          Edit
                        </Button>
                      )}
                      
                      {canCancelBooking(booking) && (
                        <Button 
                          variant="outlined" 
                          size="small"
                          fullWidth
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </Stack>
                  </Grid>

                </Grid>
              </Box>
            </Card>
          ))}

          {/* Empty State */}
          {bookingData.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No bookings found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start exploring and book your perfect room!
              </Typography>
            </Box>
          )}
        </Stack>

      </Container>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={2}>
            <TextField
              fullWidth
              label="Check-in Date"
              type="date"
              value={editForm.checkIn}
              onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
            />
            <TextField
              fullWidth
              label="Check-out Date"
              type="date"
              value={editForm.checkOut}
              onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: editForm.checkIn || today }}
            />
            <TextField
              fullWidth
              label="Number of Guests"
              type="number"
              value={editForm.persons}
              onChange={(e) => setEditForm({ ...editForm, persons: parseInt(e.target.value) })}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;