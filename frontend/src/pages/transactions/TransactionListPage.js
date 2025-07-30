import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const transactionStatuses = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const TransactionListPage = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    property_id: '',
    status: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('table'); // 'table' or 'grid'

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (appliedFilters = {}) => {
    try {
      setLoading(true);
      setError('');
      
      // Add user ID to filters based on role
      const userFilters = { ...appliedFilters };
      if (currentUser?.user_id) {
        // You can uncomment this to filter by current user
        // userFilters.buyer_id = currentUser.user_id;
      }
      
      // Remove empty filters
      const cleanFilters = Object.fromEntries(
        Object.entries(userFilters).filter(([_, value]) => value !== '')
      );
      
      const response = await transactionService.getTransactions(cleanFilters);
      setTransactions(response);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchTransactions(filters);
  };

  const clearFilters = () => {
    setFilters({
      property_id: '',
      status: '',
      search: ''
    });
    fetchTransactions({});
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const toggleView = () => {
    setView(prev => prev === 'table' ? 'grid' : 'table');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/transactions/new"
          >
            New Transaction
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage property transactions on the RoTrust platform.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <TextField
                fullWidth
                name="search"
                placeholder="Search by transaction ID or property ID"
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: filters.search && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setFilters(prev => ({ ...prev, search: '' }));
                        }}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={toggleFilters}
              >
                Filters
              </Button>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>

        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="property_id"
                  label="Property ID"
                  value={filters.property_id}
                  onChange={handleFilterChange}
                  placeholder="Filter by property ID"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  name="status"
                  label="Status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  {transactionStatuses.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={clearFilters} startIcon={<ClearIcon />}>
                Clear Filters
              </Button>
            </Box>
          </Box>
        )}

        {/* Active Filters */}
        {(filters.property_id || filters.status || filters.search) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Active Filters:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filters.property_id && (
                <Chip
                  label={`Property: ${filters.property_id}`}
                  onDelete={() => setFilters(prev => ({ ...prev, property_id: '' }))}
                />
              )}
              {filters.status && (
                <Chip
                  label={`Status: ${transactionStatuses.find(s => s.value === filters.status)?.label || filters.status}`}
                  onDelete={() => setFilters(prev => ({ ...prev, status: '' }))}
                />
              )}
              {filters.search && (
                <Chip
                  label={`Search: ${filters.search}`}
                  onDelete={() => setFilters(prev => ({ ...prev, search: '' }))}
                />
              )}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Transactions List */}
      {transactions.length > 0 ? (
        view === 'table' ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Seller</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id.substring(0, 8)}...</TableCell>
                    <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Link to={`/properties/${transaction.property_id}`}>
                        {transaction.property_id.substring(0, 8)}...
                      </Link>
                    </TableCell>
                    <TableCell>{transaction.seller_id}</TableCell>
                    <TableCell>{transaction.buyer_id}</TableCell>
                    <TableCell>{transaction.price.toLocaleString()} €</TableCell>
                    <TableCell>
                      <Chip 
                        size="small"
                        label={transaction.status} 
                        color={getStatusColor(transaction.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        component={Link} 
                        to={`/transactions/${transaction.id}`}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Grid container spacing={3}>
            {transactions.map((transaction) => (
              <Grid item xs={12} sm={6} md={4} key={transaction.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      Transaction #{transaction.id.substring(0, 8)}
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Chip 
                        size="small" 
                        label={transaction.status} 
                        color={getStatusColor(transaction.status)}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Date: {new Date(transaction.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Property: <Link to={`/properties/${transaction.property_id}`}>
                        {transaction.property_id.substring(0, 8)}...
                      </Link>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Seller: {transaction.seller_id}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Buyer: {transaction.buyer_id}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Price: <strong>{transaction.price.toLocaleString()} €</strong>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/transactions/${transaction.id}`}
                    >
                      View Details
                    </Button>
                    {transaction.status === 'pending' && 
                     (currentUser?.user_id === transaction.seller_id || 
                      currentUser?.user_id === transaction.buyer_id) && (
                      <Button 
                        size="small"
                        color="error"
                        component={Link}
                        to={`/transactions/${transaction.id}/cancel`}
                      >
                        Cancel
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" paragraph>
            No transactions found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {error ? 'An error occurred while loading transactions.' : 'Try adjusting your filters or create a new transaction.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/transactions/new"
          >
            New Transaction
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default TransactionListPage;