import React from "react";
import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a202c",
        color: "white",     
        py: 6,             
        mt: "auto",         
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              MyBooking
            </Typography>
            <Typography variant="body2" sx={{ color: "#a0aec0" }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum libero officiis necessitatibus eum id quam aut illum a molestias, sint dignissimos repellat soluta aperiam eos. Animi, numquam? Esse ut mollitia ex dolore fugiat dolorem ea omnis id. Voluptates, quisquam numquam alias architecto quas aliquam ex labore vitae distinctio pariatur animi!
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" href="https://facebook.com">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" href="https://instagram.com">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" href="https://twitter.com">
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Company
            </Typography>
            <Link href="/" color="inherit" display="block" underline="hover" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link href="/hotels" color="inherit" display="block" underline="hover" sx={{ mb: 1 }}>
              Hotels
            </Link>
            <Link href="/about" color="inherit" display="block" underline="hover" sx={{ mb: 1 }}>
              About
            </Link>
            <Link href="/" color="inherit" display="block" underline="hover">
              Contact
            </Link>
          </Grid>

          {/* Cột 3: Liên hệ */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact us
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOnIcon sx={{ mr: 1, color: "#a0aec0" }} />
              <Typography variant="body2">Hanoi</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <PhoneIcon sx={{ mr: 1, color: "#a0aec0" }} />
              <Typography variant="body2">+84 987 654 321</Typography>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: "1px solid #2d3748",
            mt: 4,
            pt: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#a0aec0" }}>
            © {new Date().getFullYear()} MyBooking. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;