import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { propertyService, transactionService } from '../../services/api';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  Divider,
  Avatar,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Business as PropertyIcon,
  SwapHoriz as TransactionIcon
} from '@mui/icons-material';

// Validation schema for profile update
const ProfileSchema = Yup.object().shape({
  full_name: Yup.string()
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .nullable()
});

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProfilePage = () => {
  const { currentUser, updateProfile, error: authError } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch user's properties
      const propertiesResponse = await propertyService.getProperties({ 
        owner_id: currentUser.user_id 
      });
      setProperties(propertiesResponse);

      // Fetch user's transactions (as buyer or seller)
      const buyerTransactions = await transactionService.getUserTransactions(
        currentUser.user_id, 'buyer'
      );
      const sellerTransactions = await transactionService.getUserTransactions(
        currentUser.user_id, 'seller'
      );
      
      // Combine and sort by date (newest first)
      const allTransactions = [...buyerTransactions, ...sellerTransactions]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setTransactions(allTransactions);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSuccess('');
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');
      
      const success = await updateProfile(values);
      
      if (success) {
        setSuccess('Profile updated successfully');
        setEditMode(false);
      } else {
        setError(authError || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading user profile...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account information and view your properties and transactions.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  mb: 2
                }}
              >
                {currentUser.full_name?.charAt(0) || 'U'}
              </Avatar>
              <Typography variant="h5" component="h2">
                {currentUser.full_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser.role}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Formik
              initialValues={{
                full_name: currentUser.full_name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || ''
              }}
              validationSchema={ProfileSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, values, handleChange, resetForm }) => (
                <Form>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Full Name
                    </Typography>
                    {editMode ? (
                      <Field
                        as={TextField}
                        fullWidth
                        name="full_name"
                        value={values.full_name}
                        onChange={handleChange}
                        error={touched.full_name && Boolean(errors.full_name)}
                        helperText={touched.full_name && errors.full_name}
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1">{currentUser.full_name}</Typography>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Email
                    </Typography>
                    {editMode ? (
                      <Field
                        as={TextField}
                        fullWidth
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1">{currentUser.email}</Typography>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Phone
                    </Typography>
                    {editMode ? (
                      <Field
                        as={TextField}
                        fullWidth
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1">{currentUser.phone || 'Not provided'}</Typography>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      User ID
                    </Typography>
                    <Typography variant="body1">{currentUser.user_id}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Account Created
                    </Typography>
                    <Typography variant="body1">
                      {new Date(currentUser.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    {editMode ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          disabled={isSubmitting}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => {
                            resetForm();
                            toggleEditMode();
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={toggleEditMode}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>

        {/* Properties and Transactions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                <Tab 
                  icon={<PropertyIcon />} 
                  iconPosition="start" 
                  label="My Properties" 
                  id="profile-tab-0" 
                  aria-controls="profile-tabpanel-0" 
                />
                <Tab 
                  icon={<TransactionIcon />} 
                  iconPosition="start" 
                  label="My Transactions" 
                  id="profile-tab-1" 
                  aria-controls="profile-tabpanel-1" 
                />
              </Tabs>
            </Box>

            {/* Properties Tab */}
            <TabPanel value={tabValue} index={0}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : properties.length > 0 ? (
                <List>
                  {properties.map((property) => (
                    <ListItem 
                      key={property.id}
                      divider
                      sx={{ 
                        mb: 1,
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemText
                        primary={property.address}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {property.property_type} • {property.size} m² • {property.rooms || 0} rooms
                            </Typography>
                            <br />
                            <Chip 
                              size="small" 
                              label={property.status} 
                              color={property.status === 'active' ? 'success' : 'default'}
                              sx={{ mt: 1 }}
                            />
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          aria-label="view"
                          onClick={() => navigate(`/properties/${property.id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PropertyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No Properties Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    You don't have any registered properties yet.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<PropertyIcon />}
                    onClick={() => navigate('/properties/new')}
                  >
                    Register Property
                  </Button>
                </Box>
              )}
            </TabPanel>

            {/* Transactions Tab */}
            <TabPanel value={tabValue} index={1}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : transactions.length > 0 ? (
                <List>
                  {transactions.map((transaction) => (
                    <ListItem 
                      key={transaction.id}
                      divider
                      sx={{ 
                        mb: 1,
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemText
                        primary={`Transaction #${transaction.id.substring(0, 8)}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(transaction.created_at).toLocaleDateString()} • 
                              {transaction.price.toLocaleString()} €
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              {currentUser.user_id === transaction.seller_id ? 'Seller' : 'Buyer'}
                            </Typography>
                            <br />
                            <Chip 
                              size="small" 
                              label={transaction.status} 
                              color={
                                transaction.status === 'completed' ? 'success' : 
                                transaction.status === 'pending' ? 'warning' : 
                                'default'
                              }
                              sx={{ mt: 1 }}
                            />
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          aria-label="view"
                          onClick={() => navigate(`/transactions/${transaction.id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TransactionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No Transactions Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    You don't have any property transactions yet.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<TransactionIcon />}
                    onClick={() => navigate('/transactions/new')}
                  >
                    New Transaction
                  </Button>
                </Box>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;