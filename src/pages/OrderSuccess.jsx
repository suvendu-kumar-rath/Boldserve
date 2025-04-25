import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container, Box, Typography, Button,
    Card, CardContent, CircularProgress,
    ButtonBase
} from '@mui/material';
import { CheckCircle, Home, LocalShipping } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

// Styled Motion Button Component
const AnimatedButton = motion(ButtonBase);

const buttonVariants = {
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            yoyo: Infinity
        }
    },
    tap: {
        scale: 0.95
    }
};

const pulseVariants = {
    initial: {
        scale: 1
    },
    animate: {
        scale: [1, 1.1, 1],
        transition: {
            duration: 2,
            repeat: Infinity
        }
    }
};

const fadeInUp = {
    initial: {
        y: 60,
        opacity: 0
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderDetails = location.state;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const createOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                // Post order details to backend
                const orderResponse = await axios.post(
                    'http://localhost:8003/api/orders/create',
                    {
                        orderId: orderDetails.orderId,
                        cartItems: orderDetails.cartItems,
                        totalAmount: orderDetails.totalAmount,
                        advanceAmount: orderDetails.totalAmount * 0.5,
                        shippingAddress: orderDetails.addressData,
                        paymentStatus: 'ADVANCE_PAID',
                        orderStatus: 'PROCESSING',
                        paymentDetails: {
                            razorpayPaymentId: orderDetails.paymentDetails?.razorpay_payment_id,
                            razorpayOrderId: orderDetails.paymentDetails?.razorpay_order_id,
                            razorpaySignature: orderDetails.paymentDetails?.razorpay_signature
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // Clear cart after successful order
                localStorage.removeItem('cartItems');
                setLoading(false);

            } catch (err) {
                console.error('Error creating order:', err);
                setError('Failed to create order');
                setLoading(false);
            }
        };

        if (orderDetails) {
            createOrder();
        }
    }, [orderDetails]);

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ my: 4 }}>
                <Card sx={{ 
                    background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)',
                    color: 'white'
                }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            {error}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            sx={{
                                bgcolor: 'white',
                                color: '#FF416C',
                                mt: 2
                            }}
                        >
                            Return Home
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ my: 4 }}>
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeInUp}
            >
                <Card sx={{ 
                    background: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)',
                    color: 'white',
                    overflow: 'hidden'
                }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <motion.div
                            variants={pulseVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <CheckCircle sx={{ fontSize: 60, mb: 2 }} />
                        </motion.div>

                        <Typography variant="h5" gutterBottom>
                            Order Placed Successfully!
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Order ID: {orderDetails.orderId}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Amount Paid: ₹{orderDetails.totalAmount * 0.5} (50% Advance)
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 4 }}>
                            Remaining amount of ₹{orderDetails.totalAmount * 0.5} to be paid on delivery
                        </Typography>

                        <Box sx={{ 
                            mb: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2
                        }}>
                            <AnimatedButton
                                component={motion.div}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => navigate('/track-order', { 
                                    state: { orderId: orderDetails.orderId } 
                                })}
                            >
                                <Button
                                    variant="contained"
                                    startIcon={<LocalShipping />}
                                    sx={{ 
                                        bgcolor: 'white',
                                        color: '#00C9FF',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)'
                                        },
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                                        }
                                    }}
                                >
                                    Track Order
                                </Button>
                            </AnimatedButton>

                            <AnimatedButton
                                component={motion.div}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => navigate('/')}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={<Home />}
                                    sx={{ 
                                        color: 'white',
                                        borderColor: 'white',
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)'
                                        },
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                                        }
                                    }}
                                >
                                    Continue Shopping
                                </Button>
                            </AnimatedButton>
                        </Box>

                        {/* Order Summary with Animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Box sx={{ 
                                mt: 4, 
                                p: 2, 
                                bgcolor: 'rgba(255,255,255,0.1)',
                                borderRadius: 1,
                                backdropFilter: 'blur(10px)'
                            }}>
                                <Typography variant="h6" gutterBottom>
                                    Order Summary
                                </Typography>
                                {orderDetails.cartItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            mb: 1,
                                            p: 1,
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                borderRadius: 1
                                            }
                                        }}>
                                            <Typography>
                                                {item.name} x {item.quantity}
                                            </Typography>
                                            <Typography>
                                                ₹{item.price * item.quantity}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                ))}
                            </Box>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </Container>
    );
};

export default OrderSuccess;