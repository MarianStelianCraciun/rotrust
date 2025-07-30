import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/api';
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
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' }
];

const PropertyListPage = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    property_type: '',
    owner_id: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (appliedFilters = {}) => {
    try {
      setLoading(true);
      setError('');
      
      // Remove empty filters
      const cleanFilters = Object.fromEntries(
        Object.entries(appliedFilters).filter(([_, value]) => value !== '')
      );
      
      const response = await propertyService.getProperties(cleanFilters);
      setProperties(response);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
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
    fetchProperties(filters);
  };

  const clearFilters = () => {
    setFilters({
      property_type: '',
      owner_id: '',
      search: ''
    });
    fetchProperties({});
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  if (loading && properties.length === 0) {
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
            Properties
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/properties/new"
          >
            Register Property
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Browse and manage real estate properties registered on the RoTrust platform.
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
                placeholder="Search by address or description"
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
                  select
                  fullWidth
                  name="property_type"
                  label="Property Type"
                  value={filters.property_type}
                  onChange={handleFilterChange}
                >
                  {propertyTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="owner_id"
                  label="Owner ID"
                  value={filters.owner_id}
                  onChange={handleFilterChange}
                  placeholder="Filter by owner ID"
                />
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
        {(filters.property_type || filters.owner_id || filters.search) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Active Filters:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filters.property_type && (
                <Chip
                  label={`Type: ${propertyTypes.find(t => t.value === filters.property_type)?.label || filters.property_type}`}
                  onDelete={() => setFilters(prev => ({ ...prev, property_type: '' }))}
                />
              )}
              {filters.owner_id && (
                <Chip
                  label={`Owner: ${filters.owner_id}`}
                  onDelete={() => setFilters(prev => ({ ...prev, owner_id: '' }))}
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

      {/* Properties List */}
      <Grid container spacing={3}>
        {properties.length > 0 ? (
          properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {property.address}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip 
                      size="small" 
                      label={property.property_type} 
                      sx={{ mr: 1, textTransform: 'capitalize' }} 
                    />
                    <Chip 
                      size="small" 
                      label={property.status} 
                      color={property.status === 'active' ? 'success' : 'default'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {property.size} m² • {property.rooms} rooms
                  </Typography>
                  {property.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {property.description.length > 100
                        ? `${property.description.substring(0, 100)}...`
                        : property.description}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    Owner ID: <strong>{property.owner_id}</strong>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to={`/properties/${property.id}`}>
                    View Details
                  </Button>
                  {currentUser?.user_id === property.owner_id && (
                    <Button size="small" component={Link} to={`/properties/${property.id}/edit`}>
                      Edit
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" paragraph>
                No properties found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {error ? 'An error occurred while loading properties.' : 'Try adjusting your filters or register a new property.'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to="/properties/new"
              >
                Register Property
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default PropertyListPage;