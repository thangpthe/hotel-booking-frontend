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
  { value: 'all', label: 'Tất cả', icon: null },
  { value: 'pending', label: 'Chờ xác nhận', icon: <PendingIcon fontSize="small" /> },
  { value: 'confirmed', label: 'Đã xác nhận', icon: <CheckCircleIcon fontSize="small" /> },
  { value: 'cancelled', label: 'Đã hủy', icon: <BlockIcon fontSize="small" /> },
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
        toast.error("Vui lòng đăng nhập để xem đặt phòng");
      } else {
        toast.error("Không thể tải danh sách đặt phòng");
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
      toast.error("Thanh toán thất bại");
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
        toast.success("Cập nhật đặt phòng thành công!");
        setEditDialog(false);
        fetchMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      const { data } = await axios.delete(`/api/bookings/cancel/${bookingToCancel._id}`, { withCredentials: true });
      if (data.success) {
        toast.success("Đã hủy đặt phòng thành công");
        setBookingData(prev => prev.map(b =>
          b._id === bookingToCancel._id ? { ...b, status: 'Cancelled' } : b
        ));
        setCancelDialog(false);
        setBookingToCancel(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Hủy đặt phòng thất bại");
    }
  };

  useEffect(() => { fetchMyBookings(); }, []);

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    const configs = {
      confirmed: { color: 'success', label: 'Đã xác nhận', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, bg: '#f0fdf4', border: '#86efac' },
      pending: { color: 'warning', label: 'Chờ xác nhận', icon: <PendingIcon sx={{ fontSize: 16 }} />, bg: '#fffbeb', border: '#fcd34d' },
      cancelled: { color: 'error', label: 'Đã hủy', icon: <BlockIcon sx={{ fontSize: 16 }} />, bg: '#fef2f2', border: '#fca5a5' },
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
        <Typography color="text.secondary">Đang tải lịch sử đặt phòng...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: '#f8faff', minHeight: '100vh' }}>
      {isProcessing && (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Đang xử lý thanh toán...</Typography>
          </Paper>
        </Box>
      )}

      <Container maxWidth="xl">
        {/* Header */}
        <Box mb={5}>
          <Typography variant="h3" fontWeight="900" gutterBottom sx={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Lịch Sử Đặt Phòng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý và theo dõi tất cả đặt phòng của bạn
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} mb={4}>
          {[
            { label: 'Tổng đặt phòng', value: stats.total, color: '#3b82f6', bg: '#eff6ff', icon: <HotelIcon /> },
            { label: 'Đã xác nhận', value: stats.confirmed, color: '#22c55e', bg: '#f0fdf4', icon: <CheckCircleIcon /> },
            { label: 'Chờ xác nhận', value: stats.pending, color: '#f59e0b', bg: '#fffbeb', icon: <PendingIcon /> },
            { label: 'Tổng chi tiêu', value: formatPrice(stats.totalSpent), color: '#8b5cf6', bg: '#f5f3ff', icon: <PaymentIcon /> },
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
                              {booking.persons} khách
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>·</Typography>
                            <NightsStayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {nights} đêm
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
                          Tổng tiền
                        </Typography>
                        <Box mt={1}>
                          {booking.isPaid ? (
                            <Chip label="✅ Đã thanh toán" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                          ) : booking.status?.toLowerCase() !== 'cancelled' ? (
                            <Chip label="⏳ Chưa thanh toán" size="small" color="warning" variant="outlined" sx={{ fontWeight: 600 }} />
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
                            Thanh toán
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
                            Chỉnh sửa
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
                            Hủy đặt phòng
                          </Button>
                        )}

                        {booking.status?.toLowerCase() === 'cancelled' && (
                          <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={1}>
                            Đặt phòng này đã bị hủy
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
                {filterStatus === 'all' ? 'Chưa có đặt phòng nào' : `Không có đặt phòng "${STATUS_TABS.find(t => t.value === filterStatus)?.label}"`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filterStatus === 'all' ? 'Hãy khám phá các khách sạn tuyệt vời của chúng tôi!' : 'Thử chọn bộ lọc khác'}
              </Typography>
            </Paper>
          )}
        </Stack>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>✏️ Chỉnh sửa đặt phòng</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={2}>
            <TextField fullWidth label="Ngày check-in" type="date" value={editForm.checkIn}
              onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
              InputLabelProps={{ shrink: true }} inputProps={{ min: today }} />
            <TextField fullWidth label="Ngày check-out" type="date" value={editForm.checkOut}
              onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
              InputLabelProps={{ shrink: true }} inputProps={{ min: editForm.checkIn || today }} />
            <TextField fullWidth label="Số khách" type="number" value={editForm.persons}
              onChange={(e) => setEditForm({ ...editForm, persons: parseInt(e.target.value) })}
              InputProps={{ inputProps: { min: 1, max: 10 } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>Hủy</Button>
          <Button onClick={handleEditSubmit} variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }}>Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main', fontWeight: 700 }}>
          <WarningAmberIcon color="error" /> Xác nhận hủy đặt phòng
        </DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Bạn có chắc muốn hủy đặt phòng này không? Hành động này không thể hoàn tác.
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
          <Button onClick={() => setCancelDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>Giữ đặt phòng</Button>
          <Button onClick={handleConfirmCancel} variant="contained" color="error" sx={{ borderRadius: 2, fontWeight: 700 }}>Hủy đặt phòng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;