import React, { useState, useEffect } from 'react';
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
    ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Login from '../pages/Login'; // Import Login modal
import { keyframes } from '@mui/system';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Add pulseAnimation
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

const ITServiceProductDetails = ({ onAddToCart, isLoggedIn }) => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [returnTo, setReturnTo] = useState(null);
    const [action, setAction] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [showQuestions, setShowQuestions] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [productRating, setProductRating] = useState({
        averageRating: 0,
        totalReviews: 0
    });

    // Static product data
    const staticProducts = {
        '1': {
            _id: '1',
            productName: 'Laptop Repair Service',
            price: 499,
            description: 'Professional laptop repair service with expert technicians. We diagnose and fix hardware issues, software problems, and provide comprehensive maintenance.',
            rating: 5,
            offers: '15% OFF',
            images: [
                '/images/laptop-repair-1.jpg',
                '/images/laptop-repair-2.jpg',
                '/images/laptop-repair-3.jpg',
                '/images/laptop-repair-4.jpg'
            ],
            subCategory: 'Computer & Laptop Repair',
            salePackage: 'Complete Service',
            modelNumber: 'LR-2023',
            modelName: 'Premium Service',
            reviews: [
                {
                    rating: 5,
                    review: "Excellent repair service! Fixed my laptop in no time.",
                    date: "2024-01-15"
                },
                {
                    rating: 4,
                    review: "Professional technicians and great customer service",
                    date: "2024-01-10"
                }
            ]
        },
        '2': {
            _id: '2',
            productName: 'Network Setup & Configuration',
            price: 1499,
            description: 'Complete network infrastructure setup and configuration service. Includes router setup, network security, and Wi-Fi optimization.',
            rating: 4,
            offers: '20% OFF',
            images: [
                '/images/network-setup-1.jpg',
                '/images/network-setup-2.jpg',
                '/images/network-setup-3.jpg',
                '/images/network-setup-4.jpg'
            ],
            subCategory: 'Network Solutions',
            salePackage: 'Full Setup',
            modelNumber: 'NS-2023',
            modelName: 'Enterprise Network'
        },
        '3': {
            _id: '3',
            productName: 'Data Recovery Service',
            price: 999,
            description: 'Professional data recovery service for all storage devices. We recover lost data from hard drives, SSDs, and other storage media.',
            rating: 5,
            offers: '10% OFF',
            images: [
                '/images/data-recovery-1.jpg',
                '/images/data-recovery-2.jpg',
                '/images/data-recovery-3.jpg',
                '/images/data-recovery-4.jpg'
            ],
            subCategory: 'Data Services',
            salePackage: 'Recovery Package',
            modelNumber: 'DR-2023',
            modelName: 'Data Rescue Pro',
            reviews: [
                {
                    rating: 5,
                    review: "Recovered all my important files!",
                    date: "2024-01-20"
                }
            ]
        },
        '4': {
            _id: '4',
            productName: 'Software Installation & Setup',
            price: 299,
            description: 'Complete software installation and configuration service. Includes OS installation, software setup, and optimization.',
            rating: 4,
            offers: '25% OFF',
            images: [
                '/images/software-install-1.jpg',
                '/images/software-install-2.jpg',
                '/images/software-install-3.jpg',
                '/images/software-install-4.jpg'
            ],
            subCategory: 'Software Services',
            salePackage: 'Installation Package',
            modelNumber: 'SI-2023',
            modelName: 'Software Pro Setup'
        }
    };

    // Get product from location state or static data
    const productData = location.state?.product || staticProducts[id];

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = () => {
        setProduct(productData);
        // Set initial rating from product data
        setProductRating({
            averageRating: productData?.rating || 0,
            totalReviews: productData?.reviews?.length || 0
        });
    };

    const handleQuantityChange = (increment) => {
        setQuantity(prev => {
            const newValue = prev + increment;
            return Math.min(Math.max(1, newValue), 6); // Limit between 1 and 6
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
            // Continue with review submission
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

    const handleRatingClick = (rating) => {
        setProductRating(rating);
        // Add your rating submission logic here
    };

    const handleSubmitReview = async () => {
        if (handleAuthRequired('review')) return;
        
        try {
            // ... existing review submission code ...
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <Typography color="error" variant="h6">{error}</Typography>
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

    // Remove loading and error checks, directly check for product
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
                <Typography variant="h6">Service not found</Typography>
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
        <>
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
                                {product?.images?.map((image, index) => (
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
                                        <Box
                                            sx={{
                                                width: '90%',
                                                height: '90%',
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.productName} ${index + 1}`}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'contain',
                                                    padding: '4px'
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/default-product.jpg';
                                                }}
                                            />
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>

                            {/* Main image */}
                            <Box sx={{ 
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
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
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '95%',
                                            height: '95%',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <img
                                            src={product?.images?.[selectedImage] || '/images/default-product.jpg'}
                                            alt={product?.productName}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/default-product.jpg';
                                            }}
                                        />
                                    </Box>
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

                        {/* Quantity selector */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                <RemoveIcon />
                            </IconButton>
                            <Typography variant="h6">{quantity}</Typography>
                            <IconButton onClick={() => handleQuantityChange(1)} disabled={quantity >= 6}>
                                <AddIcon />
                            </IconButton>
                        </Box>

                        {/* Animated buttons */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                            <Button
                                variant="contained"
                                startIcon={
                                    <ShoppingCartIcon 
                                        sx={{
                                            animation: `${bounceAnimation} 2s infinite`,
                                            transformOrigin: 'center'
                                        }}
                                    />
                                }
                                onClick={handleAddToCart}
                                sx={{
                                    bgcolor: '#7B68EE',
                                    '&:hover': { 
                                        bgcolor: '#6A5ACD',
                                        '& .MuiSvgIcon-root': {
                                            animation: `${bounceAnimation} 1s infinite`
                                        }
                                    }
                                }}
                            >
                                Add to Cart
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={
                                    <ShoppingBasketIcon 
                                        sx={{
                                            animation: `${shakeAnimation} 2s infinite`,
                                            transformOrigin: 'center'
                                        }}
                                    />
                                }
                                onClick={handleBuyNow}
                                sx={{
                                    bgcolor: '#FF4081',
                                    '&:hover': { 
                                        bgcolor: '#F50057',
                                        '& .MuiSvgIcon-root': {
                                            animation: `${shakeAnimation} 1s infinite`
                                        }
                                    }
                                }}
                            >
                                Buy Now
                            </Button>
                        </Box>

                        {/* Product Description - defaultExpanded */}
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Product Description</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{product.description || 'No description available'}</Typography>
                            </AccordionDetails>
                        </Accordion>

                        {/* Specifications - defaultExpanded */}
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

                        {/* Ratings & Reviews - defaultExpanded */}
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
                                        onChange={(e) => setReviewText(e.target.value)}
                                        onClick={() => handleAuthRequired('review')}
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

                                {/* Display Reviews */}
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

                        {/* Questions & Answers - defaultExpanded */}
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
                                            handleAuthRequired('question');
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
            </Container>

            {/* Login Modal */}
            <Login
                open={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLoginSuccess}
                returnTo={returnTo}
            />
        </>
    );
};

export default ITServiceProductDetails;