import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertyService, transactionService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  SwapHoriz as TransferIcon,
  History as HistoryIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [property, setProperty] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openTransferDialog, setOpenTransferDialog] = useState(false);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch property details
        const propertyData = await propertyService.getPropertyById(id);
        setProperty(propertyData);

        // Fetch property transactions
        const transactionsData = await transactionService.getPropertyTransactions(id);
        setTransactions(transactionsData);
      } catch (err) {
        console.error('Error fetching property data:', err);
        setError('Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  const handleTransferDialogOpen = () => {
    setOpenTransferDialog(true);
  };

  const handleTransferDialogClose = () => {
    setOpenTransferDialog(false);
  };

  const handleTransferProperty = () => {
    // Close dialog and navigate to transfer page
    handleTransferDialogClose();
    navigate(`/transactions/new?property_id=${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/properties')}
            sx={{ mb: 2 }}
          >
            Back to Properties
          </Button>
          <Alert severity="error">
            {error || 'Property not found'}
          </Alert>
        </Box>
      </Container>
    );
  }

  const isOwner = currentUser?.user_id === property.owner_id;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/properties')}
          sx={{ mb: 2 }}
        >
          Back to Properties
        </Button>

        <Grid container spacing={4}>
          {/* Property Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {property.address}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={property.property_type} 
                      sx={{ textTransform: 'capitalize' }} 
                    />
                    <Chip 
                      label={property.status} 
                      color={property.status === 'active' ? 'success' : 'default'}
                    />
                  </Box>
                </Box>
                {isOwner && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    component={Link}
                    to={`/properties/${id}/edit`}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Property Details
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {property.property_type}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Size
                    </Typography>
                    <Typography variant="body1">
                      {property.size} m²
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Rooms
                    </Typography>
                    <Typography variant="body1">
                      {property.rooms || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Ownership Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Owner ID
                    </Typography>
                    <Typography variant="body1">
                      {property.owner_id}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {property.status}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Registration Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(property.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {property.description && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {property.description}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  component={Link}
                  to={`/properties/${id}/history`}
                >
                  View Property History
                </Button>
                {isOwner && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<TransferIcon />}
                    onClick={handleTransferDialogOpen}
                  >
                    Transfer Property
                  </Button>
                )}
              </Box>
            </Paper>

            {/* Property Transactions */}
            {transactions.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Transaction History
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
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
                          <TableCell>Transfer</TableCell>
                          <TableCell>{transaction.price.toLocaleString()} €</TableCell>
                          <TableCell>
                            <Chip 
                              size="small"
                              label={transaction.status} 
                              color={
                                transaction.status === 'completed' ? 'success' : 
                                transaction.status === 'pending' ? 'warning' : 
                                'default'
                              }
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
              </Paper>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ownership Verification
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VerifiedIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Blockchain Verified
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  This property's ownership information is secured and verified on the blockchain.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" gutterBottom>
                  Current Owner:
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>{property.owner_id}</strong>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Last Updated:
                </Typography>
                <Typography variant="body1">
                  {new Date(property.updated_at).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<VerifiedIcon />}
                  component={Link}
                  to={`/properties/${id}/verify`}
                >
                  Verify Ownership
                </Button>
              </CardActions>
            </Card>

            {/* Related Actions */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Related Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/properties/${id}/documents`}
                >
                  View Documents
                </Button>
                {isOwner && (
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/properties/${id}/edit`}
                  >
                    Edit Property
                  </Button>
                )}
                <Button
                  variant="outlined"
                  component={Link}
                  to="/properties"
                >
                  Browse All Properties
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Transfer Property Dialog */}
      <Dialog
        open={openTransferDialog}
        onClose={handleTransferDialogClose}
      >
        <DialogTitle>Transfer Property</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to initiate a property transfer? This will create a new transaction that will need to be completed by the buyer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTransferDialogClose}>Cancel</Button>
          <Button onClick={handleTransferProperty} variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PropertyDetailPage;