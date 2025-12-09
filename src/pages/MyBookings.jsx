// MyBookings.jsx - Complete safe version

import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Card, CardMedia, Grid, Chip, Stack, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import toast from 'react-hot-toast';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MyBookings = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const timestamp = new Date().getTime();
      
      const { data } = await axios.get(`/api/bookings/user?_t=${timestamp}`, {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (data.success) {
        // ✅ Filter out invalid bookings
        const validBookings = (data.bookings || []).filter(booking => {
          const isValid = booking && booking.hotel && booking.room;
          if (!isValid) {
            console.warn("⚠️ Invalid booking filtered out:", booking?._id);
          }
          return isValid;
        });
        
        setBookingData(validBookings);
        
        if (validBookings.length === 0 && data.bookings?.length > 0) {
          toast.error("Your bookings have missing data. Please contact support.");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.response?.status === 401) {
        toast.error("Please login to view bookings");
      } else {
        toast.error("Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId) => {
    setIsProcessing(true);
    try {
      const { data } = await axios.post("/api/bookings/stripe-payment", {
        bookingId
      }, { withCredentials: true });
      
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
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
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Booking updated successfully!");
        setEditDialog(false);
        fetchMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update booking");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const { data } = await axios.delete(`/api/bookings/cancel/${bookingId}`, {
        withCredentials: true
      });

      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
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
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return "Invalid date";
    }
  };

  const canEditBooking = (booking) => {
    if (!booking) return false;
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const hoursDiff = (checkIn - now) / (1000 * 60 * 60);
    
    return !booking.isPaid && 
           booking.status?.toLowerCase() !== 'cancelled' && 
           hoursDiff > 24;
  };

  const canCancelBooking = (booking) => {
    if (!booking) return false;
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    if (now >= checkIn && now < checkOut) return false;
    
    const hoursDiff = (checkIn - now) / (1000 * 60 * 60);
    if (hoursDiff < 24 && hoursDiff > 0) return false;
    
    return booking.status?.toLowerCase() !== 'cancelled';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: '#fafafa', minHeight: '100vh' }}>
      {isProcessing && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2 }}>
            <CircularProgress />
            <Typography mt={2}>Processing...</Typography>
          </Box>
        </Box>
      )}
      
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight="bold" gutterBottom mb={4}>
          My Bookings
        </Typography>

        <Stack spacing={2}>
          {bookingData.map((booking) => {
            // ✅ Skip invalid bookings
            if (!booking?.hotel || !booking?.room) return null;
            
            return (
              <Card key={booking._id} sx={{ boxShadow: 2 }}>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <CardMedia
                          component="img"
                          sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover' }}
                          image={`${backendUrl}/images/${booking.room.images?.[0] || 'default.jpg'}`} 
                          alt={booking.hotel.hotelName}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                        />
                        
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {booking.hotel.hotelName}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {booking.room.roomType}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                            <PeopleIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">
                              {booking.persons} Guest{booking.persons > 1 ? 's' : ''}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Check-in</Typography>
                          <Typography variant="body2" fontWeight="600">{formatDate(booking.checkIn)}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Check-out</Typography>
                          <Typography variant="body2" fontWeight="600">{formatDate(booking.checkOut)}</Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="h5" fontWeight="bold">${booking.totalPrice}</Typography>
                      <Chip 
                        label={booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)} 
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Stack spacing={1}>
                        {!booking.isPaid && booking.status?.toLowerCase() !== 'cancelled' && (
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
            );
          })}

          {bookingData.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary">No bookings found</Typography>
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
          <Button onClick={handleEditSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;