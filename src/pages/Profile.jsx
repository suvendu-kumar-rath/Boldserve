import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Container, Paper, Avatar, 
    Menu, MenuItem, Modal, TextField, Button, Snackbar, Alert, CircularProgress, Grid, Card, CardContent, Divider, IconButton, Collapse, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    Person, ArrowForward, ShoppingBag, Settings,
    Help, Block, Delete, LocationOn, Payment,
    CreditCard, AccountBalanceWallet, ExitToApp,
    Face, ExpandMore, ExpandLess, CameraAlt, Edit
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { alpha } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useAuth } from '../Context/Context';

// Define base URL for API
const API_BASE_URL = 'https://boldservebackend-production.up.railway.app/api';

// Add these animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`;

const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    
    // States for image menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    
    // States for edit modal
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        address: '',
        bio: ''
    });

    const [pincode, setPincode] = useState('');
    const [cityData, setCityData] = useState({
        city: '',
        district: ''
    });

    const [showProfileInfo, setShowProfileInfo] = useState(false);

    const [orders, setOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const [openOrderDialog, setOpenOrderDialog] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [orderDetails, setOrderDetails] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        pincode: '',
        city: '',
        district: ''
    });
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);

    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const showMessage = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data);
            setFormData({
                fullName: response.data.fullName || '',
                email: response.data.email || '',
                mobile: response.data.mobile || '',
                address: response.data.address || '',
                bio: response.data.bio || ''
            });
            localStorage.setItem('userData', JSON.stringify(response.data));
        } catch (error) {
            setError('Failed to fetch user data');
            console.error('Error fetching user data:', error);
            showMessage(
                error.response?.data?.message || 'Network error. Please check your connection.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUserData();
        // Load cart items from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
            // Calculate total
            const total = parsedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setCartTotal(total);
        }
    }, [fetchUserData]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const response = await axios.get('http://localhost:5000/api/orders/user-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            showMessage('Failed to fetch orders', 'error');
        } finally {
            setLoadingOrders(false);
        }
    };

    // Image menu handlers
    const handleImageClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
        handleMenuClose();
    };

    // Modal handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios({
                method: 'POST',
                url: `${API_BASE_URL}/users/update-profile`,
                data: {
                    email: formData.email,
                    address: formData.address,
                    bio: formData.bio
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });

            if (response.data.success) {
                const updatedUser = response.data.user;
                setUserData(updatedUser);
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                setOpenModal(false);
                showMessage('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Update error:', error);
            showMessage(
                error.response?.data?.message || 
                'Failed to update profile. Please check your connection.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePincodeChange = async (e) => {
        const value = e.target.value;
        setShippingAddress(prev => ({
            ...prev,
            pincode: value
        }));

        if (value.length === 6) {
            try {
                const response = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
                if (response.data[0].Status === "Success") {
                    setShippingAddress(prev => ({
                        ...prev,
                        city: response.data[0].PostOffice[0].Block,
                        district: response.data[0].PostOffice[0].District
                    }));
                }
            } catch (error) {
                console.error('Error fetching pincode data:', error);
            }
        }
    };

    const handleAddressChange = (e) => {
        setShippingAddress(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePlaceOrder = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/orders/create',
                {
                    shippingAddress,
                    items: cartItems,
                    totalAmount: cartTotal
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setOrderDetails(response.data.order);
                setActiveStep(1);
                
                const paymentAmount = response.data.order.totalAmount * 0.5;

                const paymentResponse = await axios.post(
                    'http://localhost:5000/api/payments/initiate',
                    {
                        orderId: response.data.order._id,
                        amount: paymentAmount
                    },
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                setPaymentStatus('success');
                setActiveStep(2);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setPaymentStatus('failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    const handleProceedToPay = () => {
        setOpenOrderDialog(true);
        setActiveStep(0);
    };

    const OrderDialog = () => (
        <Dialog 
            open={openOrderDialog} 
            onClose={() => setOpenOrderDialog(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ textAlign: 'center', color: '#7B68EE' }}>
                Complete Your Order
            </DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    <Step>
                        <StepLabel>Shipping Information</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Payment</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Confirmation</StepLabel>
                    </Step>
                </Stepper>

                {activeStep === 0 && (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Shipping Details
                        </Typography>
                        
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={userData.fullName}
                            disabled
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={userData.email}
                            disabled
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Mobile"
                            value={userData.mobile}
                            disabled
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Address Line 1"
                            name="addressLine1"
                            value={shippingAddress.addressLine1}
                            onChange={handleAddressChange}
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Address Line 2"
                            name="addressLine2"
                            value={shippingAddress.addressLine2}
                            onChange={handleAddressChange}
                            sx={{ mb: 2 }}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Pincode"
                                    value={shippingAddress.pincode}
                                    onChange={handlePincodeChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={shippingAddress.city}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="District"
                                    value={shippingAddress.district}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {activeStep === 1 && (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Payment Details
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Total Amount: ₹{orderDetails?.totalAmount}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Amount to Pay Now (50%): ₹{orderDetails?.totalAmount * 0.5}
                        </Typography>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Remaining 50% to be paid after delivery completion
                        </Alert>
                    </Box>
                )}

                {activeStep === 2 && (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        {paymentStatus === 'success' ? (
                            <>
                                <Typography variant="h6" color="success.main" gutterBottom>
                                    Order Placed Successfully!
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    Order ID: {orderDetails?._id}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => {/* Add track order logic */}}
                                    sx={{ mt: 2 }}
                                >
                                    Track Order
                                </Button>
                            </>
                        ) : (
                            <Typography variant="h6" color="error.main">
                                Payment Failed. Please try again.
                            </Typography>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                {activeStep === 0 && (
                    <Button
                        variant="contained"
                        onClick={handlePlaceOrder}
                        sx={{
                            bgcolor: '#7B68EE',
                            '&:hover': { bgcolor: '#6A5ACD' }
                        }}
                    >
                        Place Order
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ my: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ my: 8, textAlign: 'center' }}>
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={fetchUserData}
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <>
            <Container maxWidth="lg" sx={{ 
                my: 4,
                animation: `${fadeIn} 0.6s ease-out`
            }}>
                <Grid container spacing={4}>
                    {/* Welcome Card */}
                    <Grid item xs={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card sx={{ 
                                display: 'flex', 
                                p: 2, 
                                background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 20px rgba(0,0,0,0.2)'
                                }
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar 
                                        sx={{ 
                                            width: 100, 
                                            height: 100,
                                            bgcolor: alpha('#fff', 0.2),
                                            border: '3px solid #fff',
                                            animation: `${pulse} 2s infinite`
                                        }}
                                    >
                                        <Face sx={{ fontSize: 60, color: '#fff' }} />
                                    </Avatar>
                                </Box>
                                <Box sx={{ ml: 3 }}>
                                    <Typography variant="h4" sx={{ mb: 1, color: '#fff' }}>Hello,</Typography>
                                    <Typography variant="h5" sx={{ color: '#fff' }}>{userData.fullName}</Typography>
                                </Box>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* My Orders Section */}
                    <Grid item xs={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card sx={{ 
                                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.01)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                }
                            }}>
                                <CardContent sx={{ color: '#fff' }}>
                                    <ListItemButton 
                                        onClick={() => {
                                            setShowOrders(!showOrders);
                                            if (!showOrders && orders.length === 0) {
                                                fetchOrders();
                                            }
                                        }}
                                        sx={{ 
                                            p: 0, 
                                            '&:hover': { 
                                                backgroundColor: 'transparent' 
                                            } 
                                        }}
                                    >
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            width: '100%', 
                                            mb: 1 
                                        }}>
                                            <ShoppingBag sx={{ mr: 2 }} />
                                            <Typography variant="h6">My Orders</Typography>
                                            {showOrders ? <ExpandLess sx={{ ml: 'auto' }} /> : <ExpandMore sx={{ ml: 'auto' }} />}
                                        </Box>
                                    </ListItemButton>

                                    <Collapse in={showOrders} timeout="auto" unmountOnExit>
                                        <Box sx={{ mt: 2 }}>
                                            {loadingOrders ? (
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'center', 
                                                    p: 3 
                                                }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            ) : orders.length > 0 ? (
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Order ID</TableCell>
                                                                <TableCell>Date</TableCell>
                                                                <TableCell>Items</TableCell>
                                                                <TableCell>Total</TableCell>
                                                                <TableCell>Status</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {orders.map((order) => (
                                                                <TableRow key={order._id}>
                                                                    <TableCell>
                                                                        {order._id.substring(0, 8)}...
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {order.items.length} items
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        ₹{order.totalAmount}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Chip
                                                                            label={order.status}
                                                                            color={
                                                                                order.status === 'Delivered' ? 'success' :
                                                                                order.status === 'Pending' ? 'warning' :
                                                                                order.status === 'Rejected' ? 'error' :
                                                                                'default'
                                                                            }
                                                                            size="small"
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Box sx={{ 
                                                    textAlign: 'center', 
                                                    py: 4,
                                                    px: 2,
                                                    bgcolor: '#f8f9fa',
                                                    borderRadius: 1
                                                }}>
                                                    <Typography 
                                                        variant="body1" 
                                                        color="text.secondary"
                                                        sx={{ mb: 2 }}
                                                    >
                                                        You haven't placed any orders yet
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => navigate('/')}
                                                        sx={{
                                                            backgroundColor: '#7B68EE',
                                                            '&:hover': { backgroundColor: '#6A5ACD' }
                                                        }}
                                                    >
                                                        Start Shopping
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    </Collapse>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Account Settings Section */}
                    <Grid item xs={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card sx={{ 
                                background: 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.01)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                }
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
                                        Account Settings
                                    </Typography>

                                    <List component="nav" sx={{ 
                                        bgcolor: alpha('#fff', 0.1),
                                        borderRadius: 2,
                                        p: 1
                                    }}>
                                        {/* Profile Information Button */}
                                        <ListItemButton 
                                            onClick={() => setShowProfileInfo(!showProfileInfo)}
                                            sx={{
                                                borderRadius: 1,
                                                mb: 1,
                                                bgcolor: alpha('#fff', 0.1),
                                                '&:hover': {
                                                    bgcolor: alpha('#fff', 0.2)
                                                }
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Person sx={{ color: '#fff' }} />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Profile Information" 
                                                sx={{ color: '#fff' }}
                                            />
                                            {showProfileInfo ? 
                                                <ExpandLess sx={{ color: '#fff' }} /> : 
                                                <ExpandMore sx={{ color: '#fff' }} />
                                            }
                                        </ListItemButton>

                                        {/* Profile Information Collapse */}
                                        <Collapse in={showProfileInfo} timeout="auto" unmountOnExit>
                                            <Card sx={{ 
                                                m: 2, 
                                                bgcolor: alpha('#fff', 0.9),
                                                animation: `${fadeIn} 0.3s ease-out`
                                            }}>
                                                <CardContent>
                                                    <Box sx={{ mb: 4 }}>
                                                        <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                                                            Full Name
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ color: '#333', fontWeight: '500' }}>
                                                            {userData.fullName}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ mb: 4 }}>
                                                        <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                                                            Email Address
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ color: '#333', fontWeight: '500' }}>
                                                            {userData.email}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ mb: 4 }}>
                                                        <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                                                            Contact Number
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ color: '#333', fontWeight: '500' }}>
                                                            {userData.mobile || 'Not provided'}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ mb: 4 }}>
                                                        <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                                                            Address
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ color: '#333', fontWeight: '500' }}>
                                                            {userData.address || 'Not provided'}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ mb: 4 }}>
                                                        <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                                                            Bio
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ color: '#333', fontWeight: '500' }}>
                                                            {userData.bio || 'Not provided'}
                                                        </Typography>
                                                    </Box>

                                                    <Button
                                                        variant="contained"
                                                        startIcon={<Edit />}
                                                        onClick={() => setOpenModal(true)}
                                                        sx={{
                                                            backgroundColor: '#7B68EE',
                                                            '&:hover': { backgroundColor: '#6A5ACD' }
                                                        }}
                                                    >
                                                        Edit Profile
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Collapse>

                                        {/* FAQs */}
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <Help />
                                            </ListItemIcon>
                                            <ListItemText primary="FAQs" />
                                        </ListItemButton>

                                        {/* Deactivate Account */}
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <Block />
                                            </ListItemIcon>
                                            <ListItemText primary="Deactivate Account" />
                                        </ListItemButton>

                                        {/* Delete Account */}
                                        <ListItemButton sx={{ color: 'error.main' }}>
                                            <ListItemIcon>
                                                <Delete sx={{ color: 'error.main' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Delete Account" />
                                        </ListItemButton>
                                    </List>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Manage Address Section */}
                    <Grid item xs={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card sx={{ 
                                background: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.01)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                }
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
                                        Manage Address
                                    </Typography>
                                    <Box sx={{ 
                                        p: 2, 
                                        bgcolor: alpha('#fff', 0.1),
                                        borderRadius: 2
                                    }}>
                                        <TextField
                                            fullWidth
                                            label="Address Line 1"
                                            sx={{ 
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: alpha('#fff', 0.9),
                                                    '&:hover': {
                                                        bgcolor: '#fff'
                                                    }
                                                }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Address Line 2"
                                            sx={{ 
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: alpha('#fff', 0.9),
                                                    '&:hover': {
                                                        bgcolor: '#fff'
                                                    }
                                                }
                                            }}
                                        />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Pincode"
                                                    value={shippingAddress.pincode}
                                                    onChange={handlePincodeChange}
                                                    sx={{ 
                                                        '& .MuiOutlinedInput-root': {
                                                            bgcolor: alpha('#fff', 0.9),
                                                            '&:hover': {
                                                                bgcolor: '#fff'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="City"
                                                    value={shippingAddress.city}
                                                    disabled
                                                    sx={{ 
                                                        '& .MuiOutlinedInput-root': {
                                                            bgcolor: alpha('#fff', 0.9)
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Payments Section */}
                    <Grid item xs={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Card sx={{ 
                                background: 'linear-gradient(135deg, #FF57B9 0%, #A704FD 100%)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.01)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                }
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
                                        Payments
                                    </Typography>
                                    <Box sx={{ 
                                        p: 2, 
                                        bgcolor: alpha('#fff', 0.1),
                                        borderRadius: 2
                                    }}>
                                        <Button 
                                            startIcon={<AccountBalanceWallet sx={{ color: '#fff' }} />}
                                            fullWidth 
                                            sx={{ 
                                                justifyContent: 'flex-start', 
                                                mb: 2,
                                                color: '#fff',
                                                bgcolor: alpha('#fff', 0.1),
                                                '&:hover': {
                                                    bgcolor: alpha('#fff', 0.2)
                                                }
                                            }}
                                        >
                                            Saved UPI
                                        </Button>
                                        <Button 
                                            startIcon={<CreditCard sx={{ color: '#fff' }} />}
                                            fullWidth 
                                            sx={{ 
                                                justifyContent: 'flex-start',
                                                color: '#fff',
                                                bgcolor: alpha('#fff', 0.1),
                                                '&:hover': {
                                                    bgcolor: alpha('#fff', 0.2)
                                                }
                                            }}
                                        >
                                            Saved Cards
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Logout Section */}
                    <Grid item xs={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Card sx={{ 
                                background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.01)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                }
                            }}>
                                <CardContent>
                                    <Button 
                                        startIcon={<ExitToApp sx={{ color: '#fff' }} />}
                                        fullWidth 
                                        onClick={handleLogout}
                                        sx={{ 
                                            justifyContent: 'flex-start',
                                            color: '#fff',
                                            fontSize: '1.1rem',
                                            py: 1,
                                            '&:hover': {
                                                bgcolor: alpha('#fff', 0.1)
                                            }
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            {/* Edit Profile Modal */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="edit-profile-modal"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: '15px',
                    boxShadow: 24,
                    p: 4,
                    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                    animation: `${fadeIn} 0.3s ease-out`
                }}>
                    <Typography variant="h5" sx={{ mb: 4, color: '#7B68EE', textAlign: 'center' }}>
                        Edit Profile
                    </Typography>

                    {/* Non-editable fields */}
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        disabled
                        sx={{ 
                            mb: 3,
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#666",
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Mobile Number"
                        name="mobile"
                        value={formData.mobile}
                        disabled
                        sx={{ 
                            mb: 3,
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#666",
                            }
                        }}
                    />

                    {/* Editable fields */}
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        multiline
                        rows={2}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        sx={{ mb: 4 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleUpdateProfile}
                        sx={{
                            backgroundColor: '#7B68EE',
                            '&:hover': { backgroundColor: '#6A5ACD' }
                        }}
                    >
                        Update Profile
                    </Button>
                </Box>
            </Modal>

            {/* Order Dialog */}
            <OrderDialog />
        </>
    );
};

export default Profile; 