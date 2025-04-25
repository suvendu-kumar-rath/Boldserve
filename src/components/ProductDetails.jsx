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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { keyframes } from '@mui/system';
import Login from '../pages/Login';
import { ratingsAndReviewsApi } from '../utils/axios';

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

const ProductDetails = ({ onAddToCart, isLoggedIn }) => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [actionAfterLogin, setActionAfterLogin] = useState(null);
    const [productRating, setProductRating] = useState({
        averageRating: 4.5,
        totalReviews: 128
    });

    // Static product data
    const staticProducts = {
        '1': {
            _id: '1',
            productName: 'Premium Spiral Notebook',
            price: 199,
            description: 'High-quality spiral notebook with 200 pages of premium paper. Perfect for students and professionals.',
            rating: 5,
            offers: '15% OFF',
            images: [
                '/images/spiral-notebook-1.jpg',
                '/images/spiral-notebook-2.jpg',
                '/images/spiral-notebook-3.jpg',
                '/images/spiral-notebook-4.jpg'
            ],
            subCategory: 'Notebooks & Papers',
            salePackage: '1 Notebook',
            modelNumber: 'SN-2023',
            modelName: 'Premium Series'
        },
        '2': {
            _id: '2',
            productName: 'A4 Printing Paper',
            price: 299,
            description: 'High-quality A4 printing paper, 500 sheets per pack. Ideal for all types of printers.',
            rating: 4,
            offers: '10% OFF',
            images: [
                '/images/a4-paper-1.jpg',
                '/images/a4-paper-2.jpg',
                '/images/a4-paper-3.jpg',
                '/images/a4-paper-4.jpg'
            ],
            subCategory: 'Notebooks & Papers',
            salePackage: '500 Sheets',
            modelNumber: 'A4-500',
            modelName: 'Premium White'
        },
        // ... Add more products as needed
    };

    // Get product from static data
    const product = staticProducts[id];

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

    const handleQuantityChange = (increment) => {
        setQuantity(prev => {
            const newValue = prev + increment;
            return Math.min(Math.max(1, newValue), 6); // Limit between 1 and 6
        });
    };

    // Function to check login and show modal if needed
    const checkLoginAndProceed = (action) => {
        if (!isLoggedIn) {
            setActionAfterLogin(action);
            setShowLoginModal(true);
            return false;
        }
        return true;
    };

    // Handle successful login
    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        if (actionAfterLogin) {
            actionAfterLogin();
            setActionAfterLogin(null);
        }
    };

    // Handle Add to Cart
    const handleAddToCart = () => {
        const addToCartAction = () => {
            onAddToCart({ ...product, quantity });
        };
        checkLoginAndProceed(addToCartAction);
    };

    // Handle Buy Now
    const handleBuyNow = () => {
        const buyNowAction = () => {
            onAddToCart({ ...product, quantity });
            navigate('/cart');
        };
        checkLoginAndProceed(buyNowAction);
    };

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
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&:hover': { 
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                        }
                                    }}
                                    onMouseEnter={() => setSelectedImage(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.productName} ${index + 1}`}
                                        style={{
                                            maxWidth: '90%',
                                            maxHeight: '90%',
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
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    width: '100%',
                                    aspectRatio: '1',
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    mb: 2
                                }}
                            >
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
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 2
                                }}>
                                    <IconButton 
                                        onClick={() => handleQuantityChange(-1)} 
                                        disabled={quantity <= 1}
                                        sx={{ 
                                            bgcolor: '#7B68EE20',
                                            '&:hover': { bgcolor: '#7B68EE30' }
                                        }}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography variant="h6">{quantity}</Typography>
                                    <IconButton 
                                        onClick={() => handleQuantityChange(1)} 
                                        disabled={quantity >= 6}
                                        sx={{ 
                                            bgcolor: '#7B68EE20',
                                            '&:hover': { bgcolor: '#7B68EE30' }
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
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

                                {/* Content Cards directly under buttons */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 2, 
                                    mt: 2,
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
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* Right side - Product details */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h4" gutterBottom>
                            {product.productName}
                        </Typography>

                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2, 
                            mb: 2 
                        }}>
                            <Rating 
                                value={productRating.averageRating} 
                                precision={0.5} 
                                readOnly 
                                sx={{ color: '#7B68EE' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                ({productRating.totalReviews} Reviews)
                            </Typography>
                        </Box>

                        <Typography variant="h5" sx={{ color: '#7B68EE', mb: 3 }}>
                            ₹{product.price}
                        </Typography>

                        {/* Description and Specifications with defaultExpanded */}
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Full Description</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{product.description}</Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Product Description</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{product.description}</Typography>
                            </AccordionDetails>
                        </Accordion>

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

                        {/* Updated Reviews Section */}
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: 2,
                                    width: '100%'
                                }}>
                                    <Typography variant="h6">
                                        Ratings & Reviews
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Rating 
                                            value={productRating.averageRating} 
                                            precision={0.5} 
                                            readOnly 
                                            size="small"
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            ({productRating.totalReviews} {productRating.totalReviews === 1 ? 'Review' : 'Reviews'})
                                        </Typography>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                {/* Review Statistics */}
                                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Customer Reviews
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Typography variant="h3" sx={{ color: '#7B68EE' }}>
                                            {productRating.averageRating.toFixed(1)}
                                        </Typography>
                                        <Box>
                                            <Rating 
                                                value={productRating.averageRating} 
                                                precision={0.5} 
                                                readOnly 
                                                sx={{ color: '#7B68EE' }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                Based on {productRating.totalReviews} reviews
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Write Review Section */}
                                <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Write a Review
                                    </Typography>
                                    <Rating
                                        value={productRating.averageRating}
                                        onChange={(_, newValue) => {
                                            if (checkLoginAndProceed(() => setProductRating({
                                                ...productRating,
                                                averageRating: newValue
                                            }))) {
                                                setProductRating({
                                                    ...productRating,
                                                    averageRating: newValue
                                                });
                                            }
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={product.reviewText || ''}
                                        onChange={(e) => {
                                            if (checkLoginAndProceed(() => setProductRating({
                                                ...productRating,
                                                reviewText: e.target.value
                                            }))) {
                                                setProductRating({
                                                    ...productRating,
                                                    reviewText: e.target.value
                                                });
                                            }
                                        }}
                                        placeholder="Write your review here..."
                                        sx={{ mb: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            if (checkLoginAndProceed(() => {
                                                // Handle submission
                                                // This is a placeholder and should be replaced with actual submission logic
                                            })) {
                                                // Handle submission
                                                // This is a placeholder and should be replaced with actual submission logic
                                            }
                                        }}
                                        sx={{ bgcolor: '#7B68EE', '&:hover': { bgcolor: '#6A5ACD' } }}
                                    >
                                        Submit Review
                                    </Button>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                {/* Display Reviews */}
                                {productRating.totalReviews > 0 ? (
                                    <Box sx={{ textAlign: 'center', p: 3 }}>
                                        <Typography color="text.secondary">
                                            {productRating.totalReviews} {productRating.totalReviews === 1 ? 'Review' : 'Reviews'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: 'center', p: 3 }}>
                                        <Typography color="text.secondary">
                                            No reviews yet. Be the first to review this product!
                                        </Typography>
                                    </Box>
                                )}
                            </AccordionDetails>
                        </Accordion>

                        {/* Questions & Answers section defaultExpanded */}
                        <Accordion defaultExpanded>
                            <AccordionSummary 
                                expandIcon={<ExpandMoreIcon />}
                                onClick={() => {
                                    if (checkLoginAndProceed(() => {
                                        // Handle adding new question
                                    })) {
                                        // Handle adding new question
                                    }
                                }}
                            >
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
                    </Box>
                </Grid>
            </Grid>

            {/* Product Highlights */}
            <Paper
                elevation={2}
                sx={{
                    mt: 3,
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
                                <ListItemText primary="Durable Material" />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={6}>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon sx={{ color: '#7B68EE' }} />
                                </ListItemIcon>
                                <ListItemText primary="Long Lasting" />
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

            {/* Login Modal */}
            <Login
                open={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLoginSuccess}
                initialMode="login"
            />
        </Container>
    );
};

export default ProductDetails;