import { 
  Box, Card, CardContent, Container, Grid, Typography, Avatar, Rating, Stack 
} from '@mui/material';
import React from 'react';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Travel Blogger',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: 'Amazing experience! The booking process was smooth and the hotel exceeded my expectations. Highly recommend MyBooking for hassle-free reservations.',
    date: '2 weeks ago'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Business Traveler',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    comment: 'I travel frequently for work and MyBooking has become my go-to platform. Great prices, excellent customer service, and a wide selection of hotels.',
    date: '1 month ago'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Family Vacation',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    comment: 'Booked a family suite for our vacation. The entire experience was wonderful from start to finish. Easy to use and great value for money.',
    date: '3 weeks ago'
  },
];

const Testimonial = () => {
  return (
    <Box component="section" py={8} sx={{ bgcolor: '#f9fafb' }}>
      <Container maxWidth="xl">
        
        {/* Section Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant='h3' 
            component="h2" 
            gutterBottom 
            fontWeight="bold"
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            What Our Guests Say
          </Typography>
          <Typography 
            variant='body1' 
            color='text.secondary'
            sx={{ 
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Real experiences from real travelers who booked with us
          </Typography>
        </Box>

        {/* Testimonials Grid */}
        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((testimonial) => (
            <Grid item xs={12} sm={6} md={4} key={testimonial.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                  }
                }}
              >
                {/* Quote Icon */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: 20,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    width: 50,
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <FormatQuoteIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>

                <CardContent sx={{ p: 4, pt: 5 }}>
                  
                  {/* Rating */}
                  <Rating 
                    value={testimonial.rating} 
                    readOnly 
                    sx={{ mb: 2 }}
                  />

                  {/* Comment */}
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.7,
                      fontSize: '0.95rem',
                      fontStyle: 'italic'
                    }}
                  >
                    "{testimonial.comment}"
                  </Typography>

                  {/* Divider */}
                  <Box sx={{ borderTop: '1px solid #e5e7eb', pt: 3, mt: 'auto' }} />

                  {/* User Info */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      sx={{ width: 50, height: 50 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Date */}
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ display: 'block', mt: 2, textAlign: 'right' }}
                  >
                    {testimonial.date}
                  </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Join thousands of satisfied customers
          </Typography>
          <Typography 
            variant="h6" 
            color="primary" 
            fontWeight="bold"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Book Your Next Stay →
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default Testimonial;