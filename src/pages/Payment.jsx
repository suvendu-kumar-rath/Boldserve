import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container, Box, Typography, Button,
    Card, CardContent, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, totalAmount, addressData, userData } = location.state;
    const [loading, setLoading] = useState(false);

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await initializeRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load');
                return;
            }

            // Get order details from backend
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8003/api/payment/create-order',
                {
                    amount: totalAmount * 0.5, // 50% of total amount
                    cartItems,
                    addressData
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: response.data.amount,
                currency: "INR",
                name: "BoldServe",
                description: "Payment for your order",
                order_id: response.data.id,
                handler: async function (response) {
                    try {
                        // Verify payment with backend
                        const paymentVerification = await axios.post(
                            'http://localhost:5000/api/payment/verify',
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            },
                            {
                                headers: { 'Authorization': `Bearer ${token}` }
                            }
                        );

                        if (paymentVerification.data.success) {
                            // Navigate to success page with order details
                            navigate('/order-success', {
                                state: {
                                    orderId: response.razorpay_order_id,
                                    paymentId: response.razorpay_payment_id,
                                    cartItems,
                                    totalAmount,
                                    addressData,
                                    paymentDetails: response
                                }
                            });
                        } else {
                            navigate('/order-failed');
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        navigate('/order-failed');
                    }
                },
                prefill: {
                    name: userData.fullName,
                    email: userData.email,
                    contact: userData.mobile
                },
                notes: {
                    address: addressData.address1
                },
                theme: {
                    color: "#9708CC"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                navigate('/order-failed', {
                    state: {
                        error: response.error.description
                    }
                });
            });
            
            paymentObject.open();
        } catch (error) {
            console.error('Payment initialization failed:', error);
            navigate('/order-failed', {
                state: {
                    error: 'Failed to initialize payment'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ my: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card sx={{ 
                    background: 'linear-gradient(135deg, #FF57B9 0%, #A704FD 100%)',
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            Payment Details
                        </Typography>
                        <Box sx={{ my: 3 }}>
                            <Typography variant="h6">
                                Total Amount: ₹{totalAmount}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                Advance Payment (50%): ₹{totalAmount * 0.5}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                                Remaining amount to be paid on delivery
                            </Typography>
                        </Box>
                        
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handlePayment}
                                disabled={loading}
                                sx={{
                                    bgcolor: 'white',
                                    color: '#A704FD',
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.9)'
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: '#A704FD' }} />
                                ) : (
                                    'Pay Now'
                                )}
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </Container>
    );
};

export default Payment;