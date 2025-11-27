/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, Tooltip, 
  Button
} from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import BedroomParentIcon from '@mui/icons-material/BedroomParent'; 
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

const drawerWidth = 240;

const OwnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {user,setUser,logout} = useContext(AppContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/owner/dashboard' },
    { text: 'Rooms', icon: <BedroomParentIcon />, path: '/owner/rooms' },
    { text: 'Bookings', icon: <BookOnlineIcon />, path: '/owner/bookings' },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'owner') {
      toast.error('Access denied. Owner only.');
      navigate('/');
    }
  }, [user, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
     console.log(user);
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async() => {
  //   try{
  //         const {data} = await axios.post("/api/user/logout",{},{withCredentials:true});
  //       //   if(data.success){
  //       //      toast.success("Logout success!");
  //       //      setOwner(false);
  //       //      navigate('/'); 
  //       //   }
  //       //   else{
  //       //     toast.error("Logout fail");
  //       //   }
  //       // }catch(error){
  //       //   console.log(error);
  //       //   toast.error("Logout fail");
  //       // }
  //       setUser(null);
  //   localStorage.removeItem('user');
  //   navigate('/');
    
  //   if (data.success) {
  //     toast.success("Logged out successfully!");
  //   }
  // } catch (error) { 
  //   setUser(null);
  //   localStorage.removeItem('user');
  //   navigate('/');
  //   console.log(error);
  // };

  try {
      if (logout) {
        await logout();
      } else {
        // Fallback
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
      }
      toast.success("Logged out successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  }
  
  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
        <Typography variant="h6" noWrap component="div" fontWeight="bold" color="primary">
         MyBooking
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.main' },
                    '& .MuiListItemIcon-root': { color: 'inherit' }
                  },
                  m: 1,
                  borderRadius: 2,
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'inherit' : 'gray' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
   
    
    <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      
      {/* --- APP BAR (HEADER) --- */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'black',
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
         

          <Box sx={{ display:'flex',flexGrow: 1 ,gap:2,alignItems:'center',justifyContent:'flex-end'}}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#333', display: { xs: 'none', sm: 'block' } }}>
             Hi, {user?.name || 'Owner'}
            </Typography>
            
            <Button variant='contained' onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer (Permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* --- MAIN CONTENT --- */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default OwnerLayout;