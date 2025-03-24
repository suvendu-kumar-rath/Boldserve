import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Divider,
    CircularProgress,
    IconButton,
    Paper,
    ButtonBase,
    TableCell,
    Avatar,
    TextField,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import styled from '@emotion/styled';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useAuth } from '../Context/Context';

// Wrap Card component with motion
const MotionCard = motion(Card);

// Add these animation variants
const buttonVariants = {
    initial: {
        scale: 1,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
    },
    hover: {
        scale: 1.05,
        boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
        transition: {
            duration: 0.3,
            yoyo: Infinity
        }
    },
    tap: {
        scale: 0.95
    }
};

// Replace your existing Checkout button with this animated version
const AnimatedButton = motion(ButtonBase);

// Add these styled components at the top
// Update the AnimatedCheckoutButton styling
const AnimatedCheckoutButton = styled(motion.button)({
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    background: 'linear-gradient(45deg, #25D366 30%, #128C7E 90%)', // WhatsApp colors
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)', // WhatsApp green shadow
    '&:hover': {
        boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
        transform: 'translateY(-2px)'
    }
});

const Cart = ({ onCartUpdate }) => {
    const { isAuthenticated } = useAuth();
    const [cartData, setCartData] = useState({
        items: [],
        summary: {
            subtotal: 0,
            platformFee: 5,
            additionalCharge: 0,
            gst: 0,
            total: 0
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const clearCartAfterDelay = () => {
        setTimeout(() => {
            setCartData({
                items: [],
                summary: {
                    subtotal: 0,
                    platformFee: 0,
                    additionalCharge: 0,
                    gst: 0,
                    total: 0
                }
            });
            localStorage.removeItem('cart');
            if (onCartUpdate) {
                onCartUpdate(0);
            }
        }, 1000);
    };

    const createWhatsAppMessage = (cartItems, summary) => {
        const itemsList = cartItems.map(item =>
            `• ${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
        ).join('%0A');

        const message =
            `*New Order Details*%0A%0A` +
            `${itemsList}%0A%0A` +
            `*Order Summary*%0A` +
            `Subtotal: ₹${summary.subtotal.toFixed(2)}%0A` +
            `GST (18%): ₹${(summary.subtotal * 0.18).toFixed(2)}%0A` +
            `Total Amount: ₹${(summary.subtotal + (summary.subtotal * 0.18)).toFixed(2)}%0A%0A` +
            `Please confirm my order. Thank you!`;

        return message;
    };

    const loadCartData = useCallback(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart)) {
                    const itemsWithDefaults = parsedCart.map(item => ({
                        ...item,
                        quantity: item.quantity || 1,
                        price: parseFloat(item.price) || 0,
                        name: item.name || item.productName,
                        image: item.image || item.fullImageUrl
                    }));

                    const cartWithSummary = calculateCartSummary(itemsWithDefaults);
                    setCartData(cartWithSummary);

                    if (onCartUpdate) {
                        onCartUpdate(itemsWithDefaults.length);
                    }
                } else {
                    setCartData({
                        items: [],
                        summary: {
                            subtotal: 0,
                            platformFee: 0,
                            additionalCharge: 0,
                            gst: 0,
                            total: 0
                        }
                    });
                    if (onCartUpdate) {
                        onCartUpdate(0);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            setCartData({
                items: [],
                summary: {
                    subtotal: 0,
                    platformFee: 0,
                    additionalCharge: 0,
                    gst: 0,
                    total: 0
                }
            });
            if (onCartUpdate) {
                onCartUpdate(0);
            }
        } finally {
            setLoading(false);
        }
    }, [onCartUpdate]);

    useEffect(() => {
        loadCartData();
    }, [loadCartData]);

    const handleDelete = (itemId) => {
        setCartData(prevCartData => {
            const remainingItems = prevCartData.items.filter(item => item._id !== itemId);
            const updatedCart = calculateCartSummary(remainingItems);

            localStorage.setItem('cart', JSON.stringify(remainingItems));

            if (onCartUpdate) {
                onCartUpdate(remainingItems.length);
            }

            return updatedCart;
        });
    };

    const updateItemQuantity = async (itemId, newQuantity) => {
        try {
            const updatedItems = cartData.items.map(item => 
                item._id === itemId ? { ...item, quantity: newQuantity } : item
            );
            const updatedCart = calculateCartSummary(updatedItems);
            localStorage.setItem('cart', JSON.stringify(updatedItems));

            if (onCartUpdate) {
                onCartUpdate(updatedItems.length);
            }

            setCartData(updatedCart);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const calculateCartSummary = (items) => {
        if (!Array.isArray(items)) {
            return {
                items: [],
                summary: {
                    subtotal: 0,
                    platformFee: 0,
                    additionalCharge: 0,
                    gst: 0,
                    total: 0
                }
            };
        }

        const itemsWithDefaults = items.map(item => ({
            ...item,
            quantity: item.quantity || 1,
            price: parseFloat(item.price) || 0
        }));

        const subtotal = itemsWithDefaults.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0);
        const additionalCharge = subtotal * 0.02;
        const gst = subtotal * 0.18;
        const platformFee = itemsWithDefaults.length > 0 ? 5 : 0;
        const total = subtotal + additionalCharge + gst + platformFee;

        return {
            items: itemsWithDefaults,
            summary: {
                subtotal,
                platformFee,
                additionalCharge,
                gst,
                total
            }
        };
    };

    const fetchProductImage = async (productId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8003'}/api/services/category/${productId}`);

            if (response.data && response.data.data) {
                const productData = response.data.data;
                return productData.images && productData.images.length > 0
                    ? productData.images[0]
                    : '/images/default-product.jpg';
            } else {
                console.warn('Product data not found:', productId);
                return '/images/default-product.jpg';
            }
        } catch (error) {
            console.error('Error fetching product image:', error);
            setError('Failed to load product image');
            return '/images/default-product.jpg';
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product) => {
        try {
            const existingCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const existingItem = existingCartItems.find(item => item._id === product._id);
            let updatedItems;

            if (existingItem) {
                updatedItems = existingCartItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                const newItem = {
                    _id: product._id,
                    name: product.productName,
                    price: product.price,
                    quantity: 1,
                    image: product.images[0]
                };
                updatedItems = [...existingCartItems, newItem];
            }

            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            setCartData(prevCartData => ({
                ...prevCartData,
                items: updatedItems
            }));

            calculateCartSummary(updatedItems);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const handleQuantityChange = (productId, change) => {
        setCartData(prevCartData => {
            const updatedItems = prevCartData.items.map(item =>
                item._id === productId
                    ? {
                        ...item,
                        quantity: Math.max(1, item.quantity + change)
                    }
                    : item
            );

            const updatedCart = calculateCartSummary(updatedItems);
            localStorage.setItem('cart', JSON.stringify(updatedItems));

            if (onCartUpdate) {
                onCartUpdate(updatedItems.length);
            }

            return updatedCart;
        });
    };

    const handleRemoveItem = (productId) => {
        setCartData(prevCartData => {
            const updatedItems = prevCartData.items.filter(item => item._id !== productId);
            const updatedCart = calculateCartSummary(updatedItems);

            localStorage.setItem('cart', JSON.stringify(updatedItems));

            if (onCartUpdate) {
                onCartUpdate(updatedItems.length);
            }

            return updatedCart;
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!cartData || !cartData.items) {
        return (
            <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Your cart is empty
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingBagIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    Continue Shopping
                </Button>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                <ShoppingCartIcon sx={{ mr: 1 }} />
                Shopping Cart
            </Typography>

            {cartData.items.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingBagIcon />}
                        onClick={() => navigate('/')}
                        sx={{ mt: 2 }}
                    >
                        Continue Shopping
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <AnimatePresence mode="popLayout">
                            {cartData.items.map((item) => (
                                <MotionCard
                                    key={item._id}
                                    sx={{ mb: 2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={3}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {loading ? (
                                                            <CircularProgress size={40} />
                                                        ) : (
                                                            <Avatar
                                                                src={`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8003'}${item.image || ''}`}
                                                                alt={item.name}
                                                                variant="rounded"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/images/default-product.jpg';
                                                                }}
                                                                sx={{
                                                                    width: 100,
                                                                    height: 100,
                                                                    borderRadius: '8px',
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                                    bgcolor: 'white',
                                                                    '& img': {
                                                                        objectFit: 'contain',
                                                                        padding: '6px',
                                                                        width: '100%',
                                                                        height: '100%'
                                                                    },
                                                                    transition: 'transform 0.3s ease',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.05)'
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        <Box>
                                                            <Typography sx={{
                                                                color: 'white',
                                                                fontSize: '1rem',
                                                                fontWeight: 500
                                                            }}>
                                                                {item.name}
                                                            </Typography>
                                                            {error && (
                                                                <Typography sx={{
                                                                    color: '#ffcdd2',
                                                                    fontSize: '0.75rem',
                                                                    mt: 0.5
                                                                }}>
                                                                    {error}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <Typography variant="h6">{item.name || item.productName}</Typography>
                                                <Typography variant="body1" color="primary">
                                                    Price: ₹{parseFloat(item.price).toFixed(2)}
                                                </Typography>
                                                <Typography variant="body1" color="primary" fontWeight="bold">
                                                    Total: ₹{(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Paper
                                                    elevation={3}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '8px',
                                                        borderRadius: '20px'
                                                    }}
                                                >
                                                    <IconButton
                                                        onClick={() => handleQuantityChange(item._id, -1)}
                                                        color="primary"
                                                        size="small"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <TextField
                                                        type="number"
                                                        value={item.quantity || 1}
                                                        onChange={(e) => updateItemQuantity(item._id, parseInt(e.target.value))}
                                                        size="small"
                                                        sx={{ width: 50 }}
                                                    />
                                                    <IconButton
                                                        onClick={() => handleQuantityChange(item._id, 1)}
                                                        color="primary"
                                                        size="small"
                                                        disabled={(item.quantity || 1) >= 6}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <IconButton
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </MotionCard>
                            ))}
                        </AnimatePresence>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                            color: 'white',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            minHeight: '420px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <CardContent sx={{
                                p: 3,
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Order Summary
                                </Typography>
                                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 2 }} />

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>Subtotal:</Typography>
                                        <Typography>₹{cartData.summary.subtotal.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>Tax (18% GST):</Typography>
                                        <Typography>₹{(cartData.summary.subtotal * 0.18).toFixed(2)}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 2 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Total Amount:
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            ₹{(cartData.summary.subtotal + (cartData.summary.subtotal * 0.18)).toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Cart Items ({cartData.items.length})
                                    </Typography>
                                    {cartData.items.map((item) => (
                                        <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                {item.name} x {item.quantity}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                ₹{item.price * item.quantity}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <AnimatedCheckoutButton
                                        onClick={() => {
                                            if (cartData.items.length > 0) {
                                                const whatsappMessage = createWhatsAppMessage(cartData.items, cartData.summary);
                                                const whatsappUrl = `https://wa.me/+917684836139?text=${whatsappMessage}`;
                                                window.open(whatsappUrl, '_blank');
                                                clearCartAfterDelay();
                                            } else {
                                                setError('Your cart is empty!');
                                            }
                                        }}
                                    >
                                        <ShoppingCartCheckoutIcon />
                                        Book Now on WhatsApp
                                    </AnimatedCheckoutButton>
                                </motion.div>

                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Secure Checkout • 100% Purchase Protection
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default Cart;