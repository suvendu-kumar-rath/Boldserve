import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Grid, 
    Paper,
    IconButton,
    CircularProgress,
    Rating,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { keyframes } from '@mui/system';
import Login from '../pages/Login';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Define animations
const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const shakeAnimation = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
`;

const PrintDemandProductDetails = ({ onAddToCart, isLoggedIn }) => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // All state variables in one place
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [returnTo, setReturnTo] = useState(null);
    const [action, setAction] = useState(null);
    const [productRating, setProductRating] = useState({
        averageRating: 4.5,
        totalReviews: 128
    });

    // Static product data with reviews
    const staticProducts = {
        '1': {
            _id: '1',
            productName: 'Premium Business Cards',
            price: 499,
            description: 'High-quality business cards with premium finish. Perfect for professionals.',
            rating: 5,
            offers: '15% OFF',
            images: [
                '/images/business-card-1.jpg',
                '/images/business-card-2.jpg',
                '/images/business-card-3.jpg',
                '/images/business-card-4.jpg'
            ],
            subCategory: 'Business Cards',
            salePackage: '100 Cards',
            modelNumber: 'BC-2023',
            modelName: 'Premium Series',
            reviews: [
                {
                    rating: 5,
                    review: "Excellent quality business cards!",
                    date: "2024-01-15"
                },
                {
                    rating: 4,
                    review: "Great service and fast delivery",
                    date: "2024-01-10"
                }
            ]
        },
        '2': {
            _id: '2',
            productName: 'Large Format Banner',
            price: 1499,
            description: 'High-quality large format banner printing with vibrant colors.',
            rating: 4,
            offers: '20% OFF',
            images: [
                '/images/banner-1.jpg',
                '/images/banner-2.jpg',
                '/images/banner-3.jpg',
                '/images/banner-4.jpg'
            ],
            subCategory: 'Banners & Posters',
            salePackage: '1 Banner',
            modelNumber: 'BN-2023',
            modelName: 'Premium Banner'
        },
        // Add more products as needed
    };

    const product = staticProducts[id];

    const handleQuantityChange = (increment) => {
        setQuantity(prev => {
            const newValue = prev + increment;
            return Math.min(Math.max(1, newValue), 6);
        });
    };

    const handleAuthRequired = (nextAction) => {
        if (!isLoggedIn) {
            setReturnTo(location.pathname);
            setAction(nextAction);
            setShowLoginModal(true);
            return true;
        }
        return false;
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        if (action === 'review') {
            handleSubmitReview();
        } else if (action === 'addToCart') {
            handleAddToCart();
        } else if (action === 'buyNow') {
            handleBuyNow();
        }
    };

    const handleAddToCart = () => {
        if (handleAuthRequired('addToCart')) return;
        onAddToCart({ ...product, quantity });
    };

    const handleBuyNow = () => {
        if (handleAuthRequired('buyNow')) return;
        onAddToCart({ ...product, quantity });
        navigate('/cart');
    };

    const handleSubmitReview = () => {
        if (handleAuthRequired('review')) return;
        // Handle review submission logic here
        console.log('Submitting review:', { userRating, reviewText });
        setUserRating(0);
        setReviewText('');
    };

    if (!product) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <Typography variant="h6">Product not found</Typography>
                <Button 
                    variant="contained" 
                    onClick={() => navigate(-1)}
                    sx={{ bgcolor: '#7B68EE', '&:hover': { bgcolor: '#6A5ACD' } }}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
            <Grid container spacing={4}>
                {/* Left side - Images */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* Thumbnail images */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 2,
                            width: '120px'
                        }}>
                            {product.images.map((image, index) => (
                                <Paper
                                    key={index}
                                    elevation={selectedImage === index ? 3 : 1}
                                    sx={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        border: selectedImage === index ? '2px solid #7B68EE' : 'none',
                                        overflow: 'hidden'
                                    }}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.productName} ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Paper>
                            ))}
                        </Box>

                        {/* Main image and buttons section */}
                        <Box sx={{ 
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            {/* Main image */}
                            <Paper elevation={3} sx={{ 
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '400px',
                                backgroundColor: '#fff'
                            }}>
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.productName}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Paper>

                            {/* Quantity selector and buttons */}
                            <Box sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                p: 2,
                                bgcolor: '#f5f5f5',
                                borderRadius: 2
                            }}>
                                {/* Quantity selector */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 1,
                                    bgcolor: '#fff',
                                    borderRadius: 1,
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <Typography>Quantity:</Typography>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <IconButton 
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            size="small"
                                            sx={{ bgcolor: '#f0f0f0' }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography sx={{ 
                                            minWidth: '40px', 
                                            textAlign: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            {quantity}
                                        </Typography>
                                        <IconButton 
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= 6}
                                            size="small"
                                            sx={{ bgcolor: '#f0f0f0' }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* Buttons */}
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={handleAddToCart}
                                        sx={{
                                            bgcolor: '#7B68EE',
                                            '&:hover': { 
                                                bgcolor: '#6A5ACD',
                                                animation: `${bounceAnimation} 1s ease infinite`
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<ShoppingBasketIcon />}
                                        onClick={handleBuyNow}
                                        sx={{
                                            bgcolor: '#FF4081',
                                            '&:hover': { 
                                                bgcolor: '#F50057',
                                                animation: `${bounceAnimation} 1s ease infinite`
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Buy Now
                                    </Button>
                                </Box>
                            </Box>

                            {/* Additional Info Cards */}
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 2,
                                flexWrap: 'wrap'
                            }}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 1.5,
                                        flex: '1 1 calc(33.33% - 16px)',
                                        minWidth: '150px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                            animation: `${pulseAnimation} 1s ease`
                                        },
                                        bgcolor: '#F8F8FF'
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1, 
                                        color: '#7B68EE'
                                    }}>
                                        <LocalShippingIcon fontSize="small" />
                                        <Typography variant="body2" fontWeight="bold">
                                            Free Delivery
                                        </Typography>
                                    </Box>
                                </Paper>

                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 1.5,
                                        flex: '1 1 calc(33.33% - 16px)',
                                        minWidth: '150px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                            animation: `${pulseAnimation} 1s ease`
                                        },
                                        bgcolor: '#F8F8FF'
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1, 
                                        color: '#7B68EE'
                                    }}>
                                        <AssignmentReturnIcon fontSize="small" />
                                        <Typography variant="body2" fontWeight="bold">
                                            Easy Returns
                                        </Typography>
                                    </Box>
                                </Paper>

                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 1.5,
                                        flex: '1 1 calc(33.33% - 16px)',
                                        minWidth: '150px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                            animation: `${pulseAnimation} 1s ease`
                                        },
                                        bgcolor: '#F8F8FF'
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1, 
                                        color: '#7B68EE'
                                    }}>
                                        <VerifiedUserIcon fontSize="small" />
                                        <Typography variant="body2" fontWeight="bold">
                                            1 Year Warranty
                                        </Typography>
                                    </Box>
                                </Paper>

                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 1.5,
                                        flex: '1 1 calc(33.33% - 16px)',
                                        minWidth: '150px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                            animation: `${pulseAnimation} 1s ease`
                                        },
                                        bgcolor: '#F8F8FF'
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1, 
                                        color: '#7B68EE'
                                    }}>
                                        <CheckCircleIcon fontSize="small" />
                                        <Typography variant="body2" fontWeight="bold">
                                            Quality Assured
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>

                            {/* Product Highlights */}
                            <Paper
                                elevation={2}
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    bgcolor: '#F8F8FF',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    }
                                }}
                            >
                                <Typography variant="h6" gutterBottom sx={{ color: '#7B68EE' }}>
                                    Product Highlights
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <List dense>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <CheckCircleIcon sx={{ color: '#7B68EE' }} />
                                                </ListItemIcon>
                                                <ListItemText primary="Premium Quality" />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <CheckCircleIcon sx={{ color: '#7B68EE' }} />
                                                </ListItemIcon>
                                                <ListItemText primary="Professional Design" />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <List dense>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <CheckCircleIcon sx={{ color: '#7B68EE' }} />
                                                </ListItemIcon>
                                                <ListItemText primary="Quick Delivery" />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <CheckCircleIcon sx={{ color: '#7B68EE' }} />
                                                </ListItemIcon>
                                                <ListItemText primary="Best in Class" />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    </Box>
                </Grid>

                {/* Right side - Product details */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        {product.productName}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Rating value={productRating.averageRating} precision={0.5} readOnly />
                        <Typography>({productRating.totalReviews} Reviews)</Typography>
                    </Box>

                    <Typography variant="h5" sx={{ color: '#7B68EE', mb: 3 }}>
                        ₹{product.price}
                    </Typography>

                    {/* Description section */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Product Description</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{product.description || 'No description available'}</Typography>
                        </AccordionDetails>
                    </Accordion>

                    {/* Specifications section */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Specifications</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary="Sale Package"
                                        secondary={product.salePackage || 'N/A'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Model Number"
                                        secondary={product.modelNumber || 'N/A'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Model Name"
                                        secondary={product.modelName || 'N/A'}
                                    />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    {/* Ratings & Reviews section */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Ratings & Reviews</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom>Write a Review</Typography>
                                <Rating
                                    value={userRating}
                                    onChange={(_, newValue) => {
                                        if (!handleAuthRequired('review')) {
                                            setUserRating(newValue);
                                        }
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => {
                                        if (!handleAuthRequired('review')) {
                                            setReviewText(e.target.value);
                                        }
                                    }}
                                    placeholder="Write your review here..."
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleSubmitReview}
                                    sx={{ bgcolor: '#7B68EE', '&:hover': { bgcolor: '#6A5ACD' } }}
                                >
                                    Submit Review
                                </Button>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Display existing reviews */}
                            {product.reviews?.map((review, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Rating value={review.rating} readOnly size="small" />
                                    <Typography variant="body2" sx={{ my: 1 }}>
                                        {review.review}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(review.date).toLocaleDateString()}
                                    </Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </Box>
                            ))}
                        </AccordionDetails>
                    </Accordion>

                    {/* Questions & Answers section */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                width: '100%',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h6">Questions & Answers</Typography>
                                <IconButton 
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!handleAuthRequired('question')) return;
                                        // Handle adding new question
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color="text.secondary">
                                No questions yet. Be the first to ask!
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>

            {/* Login Modal with correct props */}
            <Login
                open={showLoginModal}
                onClose={() => {
                    setShowLoginModal(false);
                    setAction(null);
                    setReturnTo(null);
                }}
                onLogin={handleLoginSuccess}
                initialMode="login"
            />
        </Container>
    );
};

export default PrintDemandProductDetails;