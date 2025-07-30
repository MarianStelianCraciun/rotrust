import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          mt: 10, 
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <Box sx={{ mb: 4 }}>
          <SadIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h2" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you are looking for doesn't exist or has been moved.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          component={Link} 
          to="/"
          size="large"
        >
          Go to Homepage
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;