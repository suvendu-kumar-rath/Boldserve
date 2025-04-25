import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button,
    Grid, Card, CardContent, CircularProgress, Alert
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { ShoppingCart } from '@mui/icons-material';

// Styled components
const AnimatedTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            background: 'rgba(255, 255, 255, 1)',
        },
        '&.Mui-focused': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            background: 'rgba(255, 255, 255, 1)',
            '& fieldset': {
                borderWidth: '2px',
                borderImage: 'linear-gradient(45deg, #43CBFF, #9708CC) 1',
            }
        }
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(0, 0, 0, 0.7)',
        '&.Mui-focused': {
            background: 'linear-gradient(45deg, #43CBFF, #9708CC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }
    },
    '& .MuiOutlinedInput-input': {
        transition: 'all 0.3s ease',
        '&:focus': {
            transform: 'scale(1.01)'
        }
    }
}));

const AnimatedButton = styled(motion.button)(({ variant }) => {
    const gradients = {
        primary: 'linear-gradient(45deg, #FF512F 0%, #F09819 100%)',
        secondary: 'linear-gradient(45deg, #8E2DE2 0%, #4A00E0 100%)',
        success: 'linear-gradient(45deg, #00B4DB 0%, #0083B0 100%)',
        purple: 'linear-gradient(45deg, #DA22FF 0%, #9733EE 100%)',
        ocean: 'linear-gradient(45deg, #2193b0 0%, #6dd5ed 100%)',
        sunset: 'linear-gradient(45deg, #FF416C 0%, #FF4B2B 100%)',
        default: 'linear-gradient(45deg, #43CBFF 0%, #9708CC 100%)'
    };

    return {
        background: gradients[variant] || gradients.default,
        border: 'none',
        borderRadius: '10px',
        color: 'white',
        padding: '15px 30px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: '600',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            transform: 'translateY(-2px)'
        },
        '&:active': {
            transform: 'translateY(1px)'
        }
    };
});

// Add these animation variants
const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
        scale: 1.02,
        transition: {
            duration: 0.3,
            yoyo: Infinity
        }
    },
    tap: { scale: 0.95 }
};

const inputVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = location.state?.cartItems;
    const totalAmount = location.state?.totalAmount;

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        mobile: ''
    });

    const [addressData, setAddressData] = useState({
        address1: '',
        address2: '',
        pincode: '',
        city: '',
        district: '',
        area: ''
    });

    const [errors, setErrors] = useState({
        address1: '',
        pincode: ''
    });

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8003/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setUserData({
                        fullName: response.data.user.fullName,
                        email: response.data.user.email,
                        mobile: response.data.user.mobile
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
                // Handle error (e.g., redirect to login)
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handlePincodeChange = async (e) => {
        const pincode = e.target.value;
        setAddressData(prev => ({ ...prev, pincode }));

        if (pincode.length === 6) {
            try {
                const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
                if (response.data[0].Status === "Success") {
                    const postOffice = response.data[0].PostOffice[0];
                    setAddressData(prev => ({
                        ...prev,
                        city: postOffice.Block,
                        district: postOffice.District,
                        area: postOffice.Name
                    }));
                }
            } catch (error) {
                console.error('Error fetching pincode data:', error);
            }
        }
    };

    const validateFields = () => {
        let isValid = true;
        const newErrors = {
            address1: '',
            pincode: ''
        };

        if (!addressData.address1.trim()) {
            newErrors.address1 = 'Address is required';
            isValid = false;
        }

        if (!addressData.pincode || addressData.pincode.length !== 6) {
            newErrors.pincode = 'Valid 6-digit pincode is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleProceedToPayment = () => {
        if (validateFields()) {
            navigate('/payment', {
                state: {
                    cartItems,
                    totalAmount,
                    addressData,
                    userData
                }
            });
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '80vh' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    const handleBookNow = () => {
        const { cartItems } = location.state;
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString || '{}');

        // Prepare the order details message
        let message = `*New Order Details*\n\n`;
        message += `*Customer Details*\n`;
        message += `Name: ${userData.fullName}\n`;
        message += `Email: ${userData.email}\n\n`;
        message += `*Order Items*\n`;
        
        cartItems.forEach(item => {
            message += `- ${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
        });

        message += `\n*Total Amount*: ₹${location.state.totalAmount.toFixed(2)}`;

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // WhatsApp redirect URL
        const whatsappUrl = `https://wa.me/+917684836139?text=${encodedMessage}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
    };

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <Card sx={{ 
                    background: 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
                    padding: '2rem',
                    borderRadius: '15px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
                }}>
                    <CardContent>
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            sx={{ 
                                color: 'white',
                                textAlign: 'center',
                                mb: 4,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            Checkout
                        </Typography>

                        {/* User Information Section */}
                        <Box sx={{ mb: 4 }}>
                            <motion.div variants={inputVariants} initial="initial" animate="animate">
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <AnimatedTextField
                                            fullWidth
                                            label="Name"
                                            value={userData.fullName}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <AnimatedTextField
                                            fullWidth
                                            label="Email"
                                            value={userData.email}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <AnimatedTextField
                                            fullWidth
                                            label="Mobile"
                                            value={userData.mobile}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </motion.div>
                        </Box>

                        {/* Shipping Address Section */}
                        <Box sx={{ mb: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <motion.div 
                                        variants={inputVariants} 
                                        initial="initial" 
                                        animate="animate"
                                        transition={{ delay: 0.1 }}
                                    >
                                        <AnimatedTextField
                                            fullWidth
                                            label="Address Line 1"
                                            value={addressData.address1}
                                            onChange={(e) => setAddressData(prev => ({
                                                ...prev,
                                                address1: e.target.value
                                            }))}
                                            required
                                            placeholder="Enter your street address"
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12}>
                                    <motion.div 
                                        variants={inputVariants} 
                                        initial="initial" 
                                        animate="animate"
                                        transition={{ delay: 0.2 }}
                                    >
                                        <AnimatedTextField
                                            fullWidth
                                            label="Address Line 2"
                                            value={addressData.address2}
                                            onChange={(e) => setAddressData(prev => ({
                                                ...prev,
                                                address2: e.target.value
                                            }))}
                                            placeholder="Enter your apartment, suite, etc."
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <motion.div 
                                        variants={inputVariants} 
                                        initial="initial" 
                                        animate="animate"
                                        transition={{ delay: 0.3 }}
                                    >
                                        <AnimatedTextField
                                            fullWidth
                                            label="Pincode"
                                            value={addressData.pincode}
                                            onChange={handlePincodeChange}
                                            required
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <motion.div 
                                        variants={inputVariants} 
                                        initial="initial" 
                                        animate="animate"
                                        transition={{ delay: 0.4 }}
                                    >
                                        <AnimatedTextField
                                            fullWidth
                                            label="City"
                                            value={addressData.city}
                                            disabled
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <motion.div 
                                        variants={inputVariants} 
                                        initial="initial" 
                                        animate="animate"
                                        transition={{ delay: 0.5 }}
                                    >
                                        <AnimatedTextField
                                            fullWidth
                                            label="District"
                                            value={addressData.district}
                                            disabled
                                        />
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Order Summary */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom>Order Summary</Typography>
                            <Typography variant="body1">
                                Total Amount: ₹{totalAmount}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                50% Advance Payment: ₹{totalAmount * 0.5}
                            </Typography>
                        </Box>

                        {/* Payment Button */}
                        <Box sx={{ mt: 4 }}>
                            <motion.div
                                variants={buttonVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <AnimatedButton
                                    variant="sunset"
                                    onClick={handleProceedToPayment}
                                >
                                    <ShoppingCart />
                                    Proceed to Payment
                                </AnimatedButton>
                            </motion.div>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Container>
    );
};

export default Checkout;