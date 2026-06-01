/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Container, Typography, Card, CardMedia, Grid, Chip, Stack, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress,
  DialogContentText, ToggleButtonGroup, ToggleButton, LinearProgress, Tooltip,
  Avatar, Paper
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PaymentIcon from '@mui/icons-material/Payment';
import HotelIcon from '@mui/icons-material/Hotel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import BlockIcon from '@mui/icons-material/Block';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDate, calculateNights } from '../utils/dateUtils';
import { formatPrice } from '../utils/priceUtils';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const STATUS_TABS = [
  { value: 'all', label: 'All', icon: null },
  { value: 'pending', label: 'Pending', icon: <PendingIcon fontSize="small" /> },
  { value: 'confirmed', label: 'Confirmed', icon: <CheckCircleIcon fontSize="small" /> },
  { value: 'cancelled', label: 'Cancelled', icon: <BlockIcon fontSize="small" /> },
];

const MyBookings = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const [editDialog, setEditDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editForm, setEditForm] = useState({ checkIn: '', checkOut: '', persons: 1 });

  const [cancelDialog, setCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/bookings/user?_t=${Date.now()}`, { withCredentials: true });
      if (data.success) {
        const validBookings = (data.bookings || []).filter(b => b && b.hotel && b.room);
        setBookingData(validBookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please log in to view your bookings");
      } else {
        toast.error("Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    if (filterStatus === 'all') return bookingData;
    return bookingData.filter(b => b.status?.toLowerCase() === filterStatus);
  }, [bookingData, filterStatus]);

  const handlePayment = async (bookingId) => {
    setIsProcessing(true);
    try {
      const { data } = await axios.post("/api/bookings/stripe-payment", { bookingId }, { withCredentials: true });
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch {
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
        { checkInDate: editForm.checkIn, checkOutDate: editForm.checkOut, persons: editForm.persons },
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
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      const { data } = await axios.delete(`/api/bookings/cancel/${bookingToCancel._id}`, { withCredentials: true });
      if (data.success) {
        toast.success("Booking cancelled successfully");
        setBookingData(prev => prev.map(b =>
          b._id === bookingToCancel._id ? { ...b, status: 'Cancelled' } : b
        ));
        setCancelDialog(false);
        setBookingToCancel(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    }
  };

  useEffect(() => { fetchMyBookings(); }, []);

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    const configs = {
      confirmed: { color: 'success', label: 'Confirmed', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, bg: '#f0fdf4', border: '#86efac' },
      pending: { color: 'warning', label: 'Pending', icon: <PendingIcon sx={{ fontSize: 16 }} />, bg: '#fffbeb', border: '#fcd34d' },
      cancelled: { color: 'error', label: 'Cancelled', icon: <BlockIcon sx={{ fontSize: 16 }} />, bg: '#fef2f2', border: '#fca5a5' },
    };
    return configs[s] || { color: 'default', label: status, icon: null, bg: '#f9fafb', border: '#e5e7eb' };
  };

  const canEditBooking = (b) => !b.isPaid && b.status?.toLowerCase() !== 'cancelled';
  const canCancelBooking = (b) => {
    if (!b) return false;
    if (b.status?.toLowerCase() === 'cancelled') return false;
    if (!b.isPaid) return true;
    const now = new Date();
    const checkIn = new Date(b.checkIn);
    if (now >= checkIn) return false;
    return (checkIn - now) / (1000 * 60 * 60) >= 24;
  };

  // Thống kê nhanh
  const stats = useMemo(() => ({
    total: bookingData.length,
    confirmed: bookingData.filter(b => b.status?.toLowerCase() === 'confirmed').length,
    pending: bookingData.filter(b => b.status?.toLowerCase() === 'pending').length,
    cancelled: bookingData.filter(b => b.status?.toLowerCase() === 'cancelled').length,
    totalSpent: bookingData.filter(b => b.status?.toLowerCase() !== 'cancelled').reduce((s, b) => s + (b.totalPrice || 0), 0),
  }), [bookingData]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress size={48} thickness={4} />
        <Typography color="text.secondary">Loading your booking history...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: '#f8faff', minHeight: '100vh' }}>
      {isProcessing && (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Processing payment...</Typography>
          </Paper>
        </Box>
      )}

      <Container maxWidth="xl">
        {/* Header */}
        <Box mb={5}>
          <Typography variant="h3" fontWeight="900" gutterBottom sx={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            My Bookings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your reservations
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} mb={4}>
          {[
            { label: 'Total Bookings', value: stats.total, color: '#3b82f6', bg: '#eff6ff', icon: <HotelIcon /> },
            { label: 'Confirmed', value: stats.confirmed, color: '#22c55e', bg: '#f0fdf4', icon: <CheckCircleIcon /> },
            { label: 'Pending', value: stats.pending, color: '#f59e0b', bg: '#fffbeb', icon: <PendingIcon /> },
            { label: 'Total Spent', value: formatPrice(stats.totalSpent), color: '#8b5cf6', bg: '#f5f3ff', icon: <PaymentIcon /> },
          ].map((stat) => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8eaf6', bgcolor: stat.bg, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="900" color={stat.color}>{stat.value}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>{stat.label}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, opacity: 0.15, color: stat.color, width: 44, height: 44 }}>
                    {stat.icon}
                  </Avatar>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Filter Tabs */}
        <Box mb={3}>
          <ToggleButtonGroup
            value={filterStatus}
            exclusive
            onChange={(_, v) => v && setFilterStatus(v)}
            sx={{
              bgcolor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              p: 0.5,
              gap: 0.5,
              '& .MuiToggleButton-root': {
                border: 'none !important',
                borderRadius: '8px !important',
                px: 2,
                py: 1,
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'none',
                '&.Mui-selected': {
                  bgcolor: '#2563eb',
                  color: 'white',
                  '&:hover': { bgcolor: '#1d4ed8' },
                },
              },
            }}
          >
            {STATUS_TABS.map(tab => (
              <ToggleButton key={tab.value} value={tab.value}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {tab.icon}
                  <span>{tab.label}</span>
                  <Chip
                    label={
                      tab.value === 'all' ? bookingData.length :
                      bookingData.filter(b => b.status?.toLowerCase() === tab.value).length
                    }
                    size="small"
                    sx={{ height: 18, fontSize: '0.7rem', fontWeight: 700, ml: 0.5 }}
                  />
                </Stack>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Bookings List */}
        <Stack spacing={2}>
          {filteredBookings.map((booking) => {
            const statusCfg = getStatusConfig(booking.status);
            const nights = calculateNights(booking.checkIn, booking.checkOut);
            return (
              <Card
                key={booking._id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${statusCfg.border}`,
                  bgcolor: 'white',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' },
                }}
              >
                {/* Status Bar at top */}
                <Box sx={{ height: 4, bgcolor: statusCfg.border }} />

                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">

                    {/* Hotel + Room Info */}
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ position: 'relative', flexShrink: 0 }}>
                          <CardMedia
                            component="img"
                            sx={{ width: 90, height: 90, borderRadius: 2, objectFit: 'cover' }}
                            image={`${backendUrl}/images/${booking.room.images?.[0] || 'default.jpg'}`}
                            alt={booking.hotel.hotelName}
                            onError={(e) => e.target.src = 'https://via.placeholder.com/90x90?text=Room'}
                          />
                          <Chip
                            label={statusCfg.label}
                            size="small"
                            icon={statusCfg.icon}
                            color={statusCfg.color}
                            sx={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontWeight: 700, fontSize: '0.65rem' }}
                          />
                        </Box>

                        <Box ml={1}>
                          <Typography variant="h6" fontWeight="800" lineHeight={1.2} mb={0.5}>
                            {booking.hotel.hotelName}
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight={600} mb={0.5}>
                            {booking.room.roomType}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {booking.persons} guest{booking.persons > 1 ? 's' : ''}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>·</Typography>
                            <NightsStayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {nights} night{nights > 1 ? 's' : ''}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Dates */}
                    <Grid item xs={12} md={3}>
                      <Box sx={{ p: 2, bgcolor: '#f8faff', borderRadius: 2, border: '1px solid #e8eaf6' }}>
                        <Stack spacing={1.5}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">CHECK-IN</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <CalendarTodayIcon sx={{ fontSize: 14, color: '#2563eb' }} />
                              <Typography variant="body2" fontWeight="700" color="#1d4ed8">
                                {formatDate(booking.checkIn)}
                              </Typography>
                            </Stack>
                          </Box>
                          <Box sx={{ height: 1, bgcolor: '#e5e7eb' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">CHECK-OUT</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <CalendarTodayIcon sx={{ fontSize: 14, color: '#2563eb' }} />
                              <Typography variant="body2" fontWeight="700" color="#1d4ed8">
                                {formatDate(booking.checkOut)}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>

                    {/* Price */}
                    <Grid item xs={12} md={2}>
                      <Box>
                        <Typography variant="h4" fontWeight="900" color="#2563eb" lineHeight={1}>
                          {formatPrice(booking.totalPrice)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total
                        </Typography>
                        <Box mt={1}>
                          {booking.isPaid ? (
                            <Chip label="✅ Paid" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                          ) : booking.status?.toLowerCase() !== 'cancelled' ? (
                            <Chip label="⏳ Unpaid" size="small" color="warning" variant="outlined" sx={{ fontWeight: 600 }} />
                          ) : null}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12} md={3}>
                      <Stack spacing={1}>
                        {!booking.isPaid && booking.status?.toLowerCase() !== 'cancelled' && (
                          <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            startIcon={<PaymentIcon />}
                            onClick={() => handlePayment(booking._id)}
                            sx={{
                              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                              fontWeight: 700,
                              borderRadius: 2,
                              '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #4338ca)' }
                            }}
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
                            sx={{ borderRadius: 2, fontWeight: 600 }}
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
                            onClick={() => { setBookingToCancel(booking); setCancelDialog(true); }}
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                          >
                            Cancel Booking
                          </Button>
                        )}

                        {booking.status?.toLowerCase() === 'cancelled' && (
                          <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={1}>
                            This booking has been cancelled
                          </Typography>
                        )}
                      </Stack>
                    </Grid>

                  </Grid>
                </Box>
              </Card>
            );
          })}

          {filteredBookings.length === 0 && (
            <Paper elevation={0} sx={{ textAlign: 'center', py: 10, borderRadius: 3, border: '1px dashed #e5e7eb' }}>
              <HotelIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {filterStatus === 'all' ? 'No bookings yet' : `No "${STATUS_TABS.find(t => t.value === filterStatus)?.label}" bookings`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filterStatus === 'all' ? 'Explore our amazing hotels and book your stay!' : 'Try a different filter'}
              </Typography>
            </Paper>
          )}
        </Stack>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>✏️ Edit Booking</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={2}>
            <TextField fullWidth label="Check-in Date" type="date" value={editForm.checkIn}
              onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
              InputLabelProps={{ shrink: true }} inputProps={{ min: today }} />
            <TextField fullWidth label="Check-out Date" type="date" value={editForm.checkOut}
              onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
              InputLabelProps={{ shrink: true }} inputProps={{ min: editForm.checkIn || today }} />
            <TextField fullWidth label="Number of Guests" type="number" value={editForm.persons}
              onChange={(e) => setEditForm({ ...editForm, persons: parseInt(e.target.value) })}
              InputProps={{ inputProps: { min: 1, max: 10 } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main', fontWeight: 700 }}>
          <WarningAmberIcon color="error" /> Confirm Cancellation
        </DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogContentText>
          {bookingToCancel && (
            <Box sx={{ p: 2.5, bgcolor: '#fef2f2', borderRadius: 2, border: '1px solid #fca5a5' }}>
              <Typography variant="subtitle1" fontWeight="bold">{bookingToCancel.hotel.hotelName}</Typography>
              <Typography variant="body2" color="text.secondary">{bookingToCancel.room.roomType}</Typography>
              <Typography variant="h5" color="error" mt={1} fontWeight="800">{formatPrice(bookingToCancel.totalPrice)}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCancelDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>Keep Booking</Button>
          <Button onClick={handleConfirmCancel} variant="contained" color="error" sx={{ borderRadius: 2, fontWeight: 700 }}>Cancel Booking</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;