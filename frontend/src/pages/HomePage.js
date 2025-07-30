import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService, transactionService } from '../services/api';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Home as HomeIcon,
  Business as PropertyIcon,
  SwapHoriz as TransactionIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

const HomePage = () => {
  const { currentUser } = useAuth();
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch recent properties
        const propertiesResponse = await propertyService.getProperties({ limit: 3 });
        setRecentProperties(propertiesResponse);

        // Fetch recent transactions
        const transactionsResponse = await transactionService.getTransactions({ limit: 3 });
        setRecentTransactions(transactionsResponse);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Stats cards data
  const statsCards = [
    {
      title: 'Properties',
      icon: <PropertyIcon fontSize="large" color="primary" />,
      value: recentProperties.length,
      link: '/properties',
      color: '#e3f2fd'
    },
    {
      title: 'Transactions',
      icon: <TransactionIcon fontSize="large" color="secondary" />,
      value: recentTransactions.length,
      link: '/transactions',
      color: '#fce4ec'
    },
    {
      title: 'Market Trends',
      icon: <TrendingIcon fontSize="large" style={{ color: '#4caf50' }} />,
      value: '+5.2%',
      link: '/market',
      color: '#e8f5e9'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Welcome Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HomeIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
          <Typography variant="h4" component="h1">
            Welcome, {currentUser?.full_name || 'User'}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          RoTrust provides a secure and transparent platform for real estate transactions in Romania.
          Manage your properties, track transactions, and verify ownership with blockchain technology.
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ bgcolor: card.color, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {card.icon}
                  <Typography variant="h4" component="div">
                    {card.value}
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                  {card.title}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={card.link}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Properties */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Recent Properties
          </Typography>
          <Button component={Link} to="/properties" variant="outlined" size="small">
            View All
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {recentProperties.length > 0 ? (
            recentProperties.map((property) => (
              <Grid item xs={12} sm={4} key={property.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {property.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {property.property_type} • {property.size} m² • {property.rooms} rooms
                    </Typography>
                    <Typography variant="body2">
                      Status: <strong>{property.status}</strong>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" component={Link} to={`/properties/${property.id}`}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No properties found. Start by registering a property.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Recent Transactions */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Recent Transactions
          </Typography>
          <Button component={Link} to="/transactions" variant="outlined" size="small">
            View All
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <Grid item xs={12} sm={4} key={transaction.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Transaction #{transaction.id.substring(0, 8)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Property: {transaction.property_id}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Price: <strong>{transaction.price.toLocaleString()} €</strong>
                    </Typography>
                    <Typography variant="body2">
                      Status: <strong>{transaction.status}</strong>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" component={Link} to={`/transactions/${transaction.id}`}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No transactions found. Start by creating a property transfer.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;