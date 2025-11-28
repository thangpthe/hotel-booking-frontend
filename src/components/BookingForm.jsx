import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Stack, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AppContext } from '../context/AppContext';

const BookingForm = ({ room }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AppContext);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        persons: 1
    });

    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

     
        if (!user) {
            toast.error("Please login to book a room!");
            navigate('/login', { state: { from: location } });
            return;
        }

        if (!bookingData.checkIn || !bookingData.checkOut) {
            toast.error("Please select check-in and check-out dates");
            return;
        }

        try {
         
            const { data: checkData } = await axios.post("/api/bookings/check-availability", {
                room: room._id,
                checkInDate: bookingData.checkIn,
                checkOutDate: bookingData.checkOut
            });

            if (!checkData.success || !checkData.isAvailable) {
                toast.error("Room is not available for selected dates!");
                return;
            }

           
            const { data } = await axios.post("/api/bookings/book", {
                room: room._id,
                checkInDate: bookingData.checkIn,
                checkOutDate: bookingData.checkOut,
                persons: bookingData.persons,
                paymentMethod: "Pay At Hotel",
            });

            if (data.success) {
                toast.success(data.message);
                navigate("/my-bookings");
                window.scrollTo(0, 0);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Booking failed");
        }
    };

    return (
        <Box
            mt={4}
            mb={4}
            borderRadius={4}
            boxShadow={3}
            p={3}
            sx={{ bgcolor: 'background.paper', position: 'sticky', top: 20 }}
        >
            <Typography variant="h5" fontWeight="bold" gutterBottom mb={3}>
                Book This Room
            </Typography>

            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>

                    <TextField
                        label="Check in Date"
                        type='date'
                        value={bookingData.checkIn}
                        name='checkIn'
                        onChange={handleChange}
                        inputProps={{ min: today }}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />

                    <TextField
                        label="Check out Date"
                        type='date'
                        value={bookingData.checkOut}
                        name='checkOut'
                        inputProps={{ min: bookingData.checkIn || today }}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />

                    <TextField
                        label="Number of Person"
                        type='number'
                        value={bookingData.persons}
                        name='persons'
                        onChange={handleChange}
                        InputProps={{ inputProps: { min: 1 } }}
                        fullWidth
                    />

                    <Grid container justifyContent={'space-between'}>
                        <Typography variant='h6'>Price</Typography>
                        <Typography color='primary.main' variant='h6'>
                            ${room.pricePerNight} /night
                        </Typography>
                    </Grid>

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        size="large"
                        disabled={!room.isAvailable}
                        sx={{
                            py: 1.5,
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            "&.Mui-disabled": {
                                bgcolor: "#e0e0e0",
                                color: "#9e9e9e"
                            }
                        }}
                    >
                        {!room.isAvailable
                            ? "Currently Unavailable"
                            : user
                                ? "Book Now"
                                : "Login to Book"
                        }
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default BookingForm;