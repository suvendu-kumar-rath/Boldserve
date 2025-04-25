import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../pages/Login';
import fallbackImage from "../assets/Banners.jpg";
import notebook from "../assets/notebooks.jpg";
// import glue from "../assets/Gluestick.webp";
// import basicCalculator from "../assets/calculatorOrange.jpg";

const Products = ({ selectedSubCategory, onAddToCart, isLoggedIn }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingProduct, setPendingProduct] = useState(null);
    const navigate = useNavigate();

    // Static products data organized by subcategories
    const staticProducts = [
        // Notebooks & Papers
        {
            _id: '1',
            productName: 'Premium Spiral Notebook',
            price: 199,
            rating: 5,
            offers: '15% OFF',
            images: ['/images/spiral-notebook.jpg'],
            subCategory: 'Notebooks & Papers',
            fullImageUrl: notebook
        },
        {
            _id: '2',
            productName: 'A4 Printing Paper (500 sheets)',
            price: 299,
            rating: 4,
            offers: '10% OFF',
            images: ['/images/a4-paper.jpg'],
            subCategory: 'Notebooks & Papers',
            fullImageUrl: '/assets/paper.webp'
        },
        
        // Adhesive and Glue
        {
            _id: '3',
            productName: 'Fevicol Adhesive',
            price: 85,
            rating: 4,
            offers: '5% OFF',
            images: ['/images/fevicol.jpg'],
            subCategory: 'Adhesive and Glue',
            fullImageUrl: '/assets/fevicol.jpeg'
        },
        {
            _id: '4',
            productName: 'Glue Stick Pack',
            price: 120,
            rating: 4,
            offers: '20% OFF',
            images: ['/images/glue-stick.jpg'],
            subCategory: 'Adhesive and Glue',
            fullImageUrl: '/assets/Gluestick.webp'
        },

        // Pen & Pencil Kit
        {
            _id: '5',
            productName: 'Parker Pen Set',
            price: 599,
            rating: 5,
            offers: '25% OFF',
            images: ['/images/parker-set.jpg'],
            subCategory: 'Pen & Pencil Kit',
            fullImageUrl: '/assets/parkerpen.webp'
        },
        {
            _id: '6',
            productName: 'Mechanical Pencil Set',
            price: 299,
            rating: 4,
            offers: '10% OFF',
            images: ['/images/mechanical-pencil.jpg'],
            subCategory: 'Pen & Pencil Kit',
            fullImageUrl: '/assets/mechanical_pencil_set.jpg'
        },

        // Whitner & Marker
        {
            _id: '7',
            productName: 'Correction Pen Pack',
            price: 149,
            rating: 4,
            offers: '15% OFF',
            images: ['/images/correction-pen.jpg'],
            subCategory: 'Whitener & Marker',
            fullImageUrl: '/assets/whitener.jpg'
        },
        {
            _id: '8',
            productName: 'Permanent Marker Set',
            price: 199,
            rating: 5,
            offers: '20% OFF',
            images: ['/images/marker-set.jpg'],
            subCategory: 'Whitener & Marker',
            fullImageUrl: '/assets/marker.jpg'
        },

        // Stapler & Scissors
        {
            _id: '9',
            productName: 'Heavy Duty Stapler',
            price: 349,
            rating: 4,
            offers: '30% OFF',
            images: ['/images/stapler.jpg'],
            subCategory: 'Stapler & Scissors',
            fullImageUrl: '/assets/stapler.jpg'
        },
        {
            _id: '10',
            productName: 'Professional Scissors',
            price: 249,
            rating: 5,
            offers: '15% OFF',
            images: ['/images/scissors.jpg'],
            subCategory: 'Stapler & Scissors',
            fullImageUrl: '/assets/staplerandScissor.jpg'
        },

        // Calculator
        {
            _id: '11',
            productName: 'Scientific Calculator',
            price: 899,
            rating: 5,
            offers: '20% OFF',
            images: ['/images/scientific-calc.jpg'],
            subCategory: 'Calculator',
            fullImageUrl: 'https://example.com/scientific-calc.jpg'
        },
        {
            _id: '12',
            productName: 'Basic Calculator',
            price: 399,
            rating: 4,
            offers: '10% OFF',
            images: ['/images/basic-calc.jpg'],
            subCategory: 'Calculator',
            fullImageUrl: '/assets/calculatorOrange.jpg'
        }
    ];

    // Filter products based on selected subcategory
    const filteredProducts = selectedSubCategory 
        ? staticProducts.filter(product => product.subCategory === selectedSubCategory)
        : staticProducts;

    const formatOffer = (offer) => {
        if (!offer) return '';
        const cleanOffer = offer.replace(/off/i, '').trim();
        const numberOnly = cleanOffer.replace(/%/g, '').trim();
        return `${numberOnly}% OFF`;
    };

    const handleProductClick = (product) => {
        navigate(`/product/${product._id}`, { state: { product } });
    };

    const handleAddToCart = (product, event) => {
        event.stopPropagation();
        
        if (!isLoggedIn) {
            setPendingProduct(product);
            setShowLoginModal(true);
            return;
        }

        onAddToCart(product);
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        if (pendingProduct) {
            onAddToCart(pendingProduct);
            setPendingProduct(null);
        }
    };

    return (
        <>
            <Box sx={{ py: 3, mt: 6 }} style={{ backgroundColor: '#f5f5f5' }}>
                <Container maxWidth="xl">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        mb: 4,
                        alignItems: 'flex-start',
                        pt: 2,
                        position: 'relative'
                    }}>
                        <Typography variant="h5" sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            
                            fontSize: '1.5rem'
                        }}>
                            OFFICE STATIONARIES
                        </Typography>

                        {selectedSubCategory && (
                            <Typography variant="h5" sx={{
                                fontWeight: 'bold',
                        
                                color: '#7B68EE',
                                mb: 2,
                                mt: 1,
                                fontSize: '1.25rem'
                            }}>
                                {selectedSubCategory.toUpperCase()} PRODUCTS
                            </Typography>
                        )}
                    </Box>

                    <Grid sx={{ py: 6 }} container spacing={3}>
                        {filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={2} key={product._id}>
                                <Paper
                                    elevation={2}
                                    onClick={() => handleProductClick(product)}
                                    sx={{
                                        p: 2,
                                        width: '200px',
                                        height: '280px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        },
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        margin: '0 auto',
                                    }}
                                >
                                    {product.offers && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '8px',
                                                left: '8px',
                                                backgroundColor: 'red',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                zIndex: 1,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            }}
                                        >
                                            {formatOffer(product.offers)}
                                        </Box>
                                    )}
                                    
                                    <Box sx={{ 
                                        position: 'relative', 
                                        height: '140px',
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <img
                                            src={product.fullImageUrl}
                                            alt={product.productName}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                backgroundColor: '#fff',
                                            }}
                                            onError={(e) => (e.currentTarget.src = fallbackImage)}
                                        />
                                    </Box>

                                    <Box sx={{ 
                                        flex: 1, 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        minHeight: 0,
                                    }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold',
                                                lineHeight: 1.2,
                                                height: '2.4em',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                mb: 1,
                                            }}
                                        >
                                            {product.productName}
                                        </Typography>

                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 1,
                                        }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#7B68EE',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                ₹{product.price}
                                            </Typography>
                                            {product.rating > 0 && (
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    gap: 0.25, 
                                                    fontSize: '0.85rem'
                                                }}>
                                                    {[...Array(5)].map((_, index) => (
                                                        <span
                                                            key={index}
                                                            style={{
                                                                color: index < product.rating ? '#ffc107' : '#e0e0e0'
                                                            }}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={<ShoppingCartIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product, e);
                                            }}
                                            sx={{
                                                height: '32px',
                                                backgroundColor: '#7B68EE',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#6A5ACD'
                                                },
                                                fontSize: '0.85rem',
                                                textTransform: 'none',
                                                '& .MuiButton-startIcon': {
                                                    marginRight: '4px'
                                                }
                                            }}
                                        >
                                            Add to Cart
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Login
                open={showLoginModal}
                onClose={() => {
                    setShowLoginModal(false);
                    setPendingProduct(null);
                }}
                onLogin={handleLoginSuccess}
                initialMode="login"
            />
        </>
    );
};

export default Products;
