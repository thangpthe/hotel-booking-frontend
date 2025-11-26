import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const pages = ['About', 'Hotels', 'Rooms'];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  
  const { navigate, user, setUser, isOwner, logout } = useContext(AppContext);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuClick = (page) => {
    handleCloseNavMenu();
    const path = `/${page.toLowerCase()}`;
    navigate(path);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMyBookings = () => {
    handleCloseUserMenu();
    navigate('/my-bookings');
  };

  const handleDashboard = () => {
    handleCloseUserMenu();
    navigate('/owner/dashboard');
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    try {
      const { data } = await axios.post("/api/user/logout", {}, {
        withCredentials: true
      });
      
      if (data.success) {
        toast.success("Logged out successfully!");
        // Use logout from context to clear all states
        if (logout) {
          logout();
        } else {
          // Fallback if logout function not available
          setUser(null);
          navigate('/');
        }
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo Desktop */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            MyBooking
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleMenuClick(page)}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo Mobile */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            MyBooking
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleMenuClick(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.name || "User"} src="/static/images/avatar/2.jpg">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* User Info */}
                  <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>

                  {/* My Bookings - Show for all users */}
                  <MenuItem onClick={handleMyBookings}>
                    <Typography textAlign="center">My Bookings</Typography>
                  </MenuItem>

                  {/* Dashboard - Show only for owners */}
                  {isOwner && (
                    <MenuItem onClick={handleDashboard}>
                      <Typography textAlign="center">Owner Dashboard</Typography>
                    </MenuItem>
                  )}

                  {/* Logout */}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center" color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;