import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { transactionService, propertyService } from '../../services/api';
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
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Business as PropertyIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Description as DocumentIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const TransactionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch transaction details
        const transactionData = await transactionService.getTransactionById(id);
        setTransaction(transactionData);

        // Fetch property details
        if (transactionData.property_id) {
          const propertyData = await propertyService.getPropertyById(transactionData.property_id);
          setProperty(propertyData);
        }
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError('Failed to load transaction details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [id]);

  const handleCancelDialogOpen = () => {
    setOpenCancelDialog(true);
  };

  const handleCancelDialogClose = () => {
    setOpenCancelDialog(false);
  };

  const handleCancelTransaction = async () => {
    try {
      setLoading(true);
      await transactionService.cancelTransaction(id);
      // Refresh transaction data
      const updatedTransaction = await transactionService.getTransactionById(id);
      setTransaction(updatedTransaction);
      handleCancelDialogClose();
    } catch (err) {
      console.error('Error cancelling transaction:', err);
      setError('Failed to cancel transaction. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionStatusStep = (status) => {
    switch (status) {
      case 'completed':
        return 2;
      case 'pending':
        return 1;
      case 'cancelled':
        return -1; // Special case for cancelled
      default:
        return 0;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'cancelled':
        return <CancelIcon color="error" />;
      default:
        return <PendingIcon />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !transaction) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/transactions')}
            sx={{ mb: 2 }}
          >
            Back to Transactions
          </Button>
          <Alert severity="error">
            {error || 'Transaction not found'}
          </Alert>
        </Box>
      </Container>
    );
  }

  const isParticipant = currentUser?.user_id === transaction.seller_id || 
                        currentUser?.user_id === transaction.buyer_id;
  const canCancel = transaction.status === 'pending' && isParticipant;
  const statusStep = getTransactionStatusStep(transaction.status);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/transactions')}
          sx={{ mb: 2 }}
        >
          Back to Transactions
        </Button>

        <Grid container spacing={4}>
          {/* Transaction Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Transaction #{transaction.id.substring(0, 8)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                    {getStatusIcon(transaction.status)}
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {transaction.status}
                    </Typography>
                  </Box>
                </Box>
                {canCancel && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelDialogOpen}
                  >
                    Cancel Transaction
                  </Button>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Transaction Progress */}
              {transaction.status !== 'cancelled' && (
                <Box sx={{ mb: 4 }}>
                  <Stepper activeStep={statusStep} alternativeLabel>
                    <Step>
                      <StepLabel>Created</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>In Progress</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Completed</StepLabel>
                    </Step>
                  </Stepper>
                </Box>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Transaction Details
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Transaction ID
                    </Typography>
                    <Typography variant="body1">
                      {transaction.id}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date Created
                    </Typography>
                    <Typography variant="body1">
                      {new Date(transaction.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {new Date(transaction.updated_at).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {transaction.payment_method || 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Financial Details
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {transaction.price.toLocaleString()} €
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Seller
                    </Typography>
                    <Typography variant="body1">
                      {transaction.seller_id}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Buyer
                    </Typography>
                    <Typography variant="body1">
                      {transaction.buyer_id}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {transaction.notes && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {transaction.notes}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  startIcon={<PropertyIcon />}
                  component={Link}
                  to={`/properties/${transaction.property_id}`}
                >
                  View Property
                </Button>
                {transaction.status === 'pending' && isParticipant && (
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/transactions/${id}/complete`}
                  >
                    Complete Transaction
                  </Button>
                )}
              </Box>
            </Paper>

            {/* Property Information */}
            {property && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Property Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PropertyIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {property.address}
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Property Type
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', mb: 1 }}>
                      {property.property_type}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Size
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {property.size} m²
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Rooms
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {property.rooms || 'N/A'}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {property.status}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to={`/properties/${property.id}`}
                  >
                    View Full Property Details
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Transaction Timeline */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transaction Timeline
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ScheduleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Transaction Created"
                      secondary={new Date(transaction.created_at).toLocaleString()}
                    />
                  </ListItem>
                  
                  {transaction.status === 'completed' && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Transaction Completed"
                        secondary={new Date(transaction.updated_at).toLocaleString()}
                      />
                    </ListItem>
                  )}
                  
                  {transaction.status === 'cancelled' && (
                    <ListItem>
                      <ListItemIcon>
                        <CancelIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Transaction Cancelled"
                        secondary={new Date(transaction.updated_at).toLocaleString()}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Participants
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Seller"
                      secondary={transaction.seller_id}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Buyer"
                      secondary={transaction.buyer_id}
                    />
                  </ListItem>
                </List>
              </CardContent>
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
                  to={`/properties/${transaction.property_id}`}
                >
                  View Property
                </Button>
                {canCancel && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancelDialogOpen}
                  >
                    Cancel Transaction
                  </Button>
                )}
                <Button
                  variant="outlined"
                  component={Link}
                  to="/transactions"
                >
                  View All Transactions
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Cancel Transaction Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCancelDialogClose}
      >
        <DialogTitle>Cancel Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this transaction? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose}>No, Keep Transaction</Button>
          <Button onClick={handleCancelTransaction} color="error" variant="contained">
            Yes, Cancel Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TransactionDetailPage;