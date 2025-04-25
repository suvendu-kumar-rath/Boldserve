import { useState } from 'react';
import axios from '../utils/axios';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
} from '@mui/material';

const PaymentGateway = ({ order, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create order in Razorpay
      const response = await axios.post('/api/payments/create-order', {
        amount: order.amount,
        orderId: order._id,
        userId: order.userId,
      });

      const { order: razorpayOrder, key } = response.data;

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'BoldServe',
        description: 'Payment for services',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verificationResponse = await axios.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResponse.data.success) {
              // Update order status
              await axios.put(`/api/orders/${order._id}/status`, {
                status: 'Accepted',
              });
              
              onSuccess(verificationResponse.data);
            } else {
              onFailure('Payment verification failed');
            }
          } catch (error) {
            onFailure(error.message);
          }
        },
        prefill: {
          name: order.customerName,
          email: order.email,
          contact: order.phoneNumber,
        },
        theme: {
          color: '#2193b0',
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      setError(error.response?.data?.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={initializePayment}
        disabled={loading}
        sx={{
          background: 'linear-gradient(45deg, #2193b0 30%, #6dd5ed 90%)',
          color: 'white',
          padding: '12px 24px',
          '&:hover': {
            background: 'linear-gradient(45deg, #1c7a94 30%, #5bb8d0 90%)',
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Proceed to Payment'
        )}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Dialog open={loading}>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
            }}
          >
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>
              Initializing Payment...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PaymentGateway;