import React, { useState } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, InputAdornment, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import toast from 'react-hot-toast';
import { cities } from '../assets/assets'; 


const SearchBar = () => {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchParams.destination || !searchParams.checkIn || !searchParams.checkOut) {
      toast.error("Please fill in all fields");
      return;
    }

    console.log("Searching with params:", searchParams);
    toast.success(`Searching hotels in ${searchParams.destination}...`);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: -5, mb: 5, position: 'relative', zIndex: 10 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          maxWidth: '1100px', 
          margin: '0 auto'
        }}
      >
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            
            
            <Grid item xs={12} md={5}>
              <TextField
                select
                fullWidth
                label="Destination"
                name="destination"
                value={searchParams.destination}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                fullWidth
                label="Check In"
                name="checkIn"
                type="date"
                value={searchParams.checkIn}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                fullWidth
                label="Check Out"
                name="checkOut"
                type="date"
                value={searchParams.checkOut}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

           
            <Grid item xs={6} md={2}>
              <Grid container spacing={2}>
                
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Guests"
                    name="guests"
                    type="number"
                    value={searchParams.guests}
                    onChange={handleChange}
                    InputProps={{
                      inputProps: { min: 1 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    size="large"
                    type="submit"
                    sx={{ 
                      height: '100%', 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      fontSize: '1rem', 
                      fontWeight: 'bold',
                      boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
                    }}
                    startIcon={<SearchIcon />}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SearchBar;