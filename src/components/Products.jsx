import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../pages/Login';

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
            fullImageUrl: 'https://example.com/spiral-notebook.jpg'
        },
        {
            _id: '2',
            productName: 'A4 Printing Paper (500 sheets)',
            price: 299,
            rating: 4,
            offers: '10% OFF',
            images: ['/images/a4-paper.jpg'],
            subCategory: 'Notebooks & Papers',
            fullImageUrl: 'https://example.com/a4-paper.jpg'
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
            fullImageUrl: 'https://example.com/fevicol.jpg'
        },
        {
            _id: '4',
            productName: 'Glue Stick Pack',
            price: 120,
            rating: 4,
            offers: '20% OFF',
            images: ['/images/glue-stick.jpg'],
            subCategory: 'Adhesive and Glue',
            fullImageUrl: 'https://example.com/glue-stick.jpg'
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
            fullImageUrl: 'https://example.com/parker-set.jpg'
        },
        {
            _id: '6',
            productName: 'Mechanical Pencil Set',
            price: 299,
            rating: 4,
            offers: '10% OFF',
            images: ['/images/mechanical-pencil.jpg'],
            subCategory: 'Pen & Pencil Kit',
            fullImageUrl: 'https://example.com/mechanical-pencil.jpg'
        },

        // Whitner & Marker
        {
            _id: '7',
            productName: 'Correction Pen Pack',
            price: 149,
            rating: 4,
            offers: '15% OFF',
            images: ['/images/correction-pen.jpg'],
            subCategory: 'Whitner & Marker',
            fullImageUrl: 'https://example.com/correction-pen.jpg'
        },
        {
            _id: '8',
            productName: 'Permanent Marker Set',
            price: 199,
            rating: 5,
            offers: '20% OFF',
            images: ['/images/marker-set.jpg'],
            subCategory: 'Whitner & Marker',
            fullImageUrl: 'https://example.com/marker-set.jpg'
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
            fullImageUrl: 'https://example.com/stapler.jpg'
        },
        {
            _id: '10',
            productName: 'Professional Scissors',
            price: 249,
            rating: 5,
            offers: '15% OFF',
            images: ['/images/scissors.jpg'],
            subCategory: 'Stapler & Scissors',
            fullImageUrl: 'https://example.com/scissors.jpg'
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
            fullImageUrl: 'https://example.com/basic-calc.jpg'
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
                    <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                        Office Stationaries Products
                    </Typography>

                    <Grid sx={{ py: 6 }} container spacing={3}>
                        {filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={2} key={product._id}>
                                <Paper
                                    elevation={2}
                                    onClick={() => handleProductClick(product)}
                                    sx={{
                                        p: 1,
                                        width: '190.52px',
                                        height: '220px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        },
                                        overflow: 'visible',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {product.offers && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '-5px',
                                                left: '-5px',
                                                backgroundColor: 'red',
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                zIndex: 1,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                mt: 2,
                                                ml: 2
                                            }}
                                        >
                                            {formatOffer(product.offers)}
                                        </Box>
                                    )}
                                    <Box sx={{ position: 'relative', height: '142.89px', mb: 1 }}>
                                        <img
                                            src={product.fullImageUrl}
                                            alt={product.productName}
                                            style={{
                                                width: '166.71px',
                                                height: '142.89px',
                                                objectFit: 'contain',
                                                backgroundColor: '#fff',
                                                display: 'block',
                                                margin: '0 auto'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/default-product.jpg';
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ 
                                        flex: 1, 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        height: 'calc(220px - 142.89px - 16px)'
                                    }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                lineHeight: 1.2,
                                                height: '2.4em',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                mb: 0.5
                                            }}
                                        >
                                            {product.productName}
                                        </Typography>

                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 0.5
                                        }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#7B68EE',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                ₹{product.price}
                                            </Typography>
                                            {product.rating > 0 && (
                                                <Box sx={{ display: 'flex', gap: 0.25, fontSize: '0.75rem' }}>
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
                                            startIcon={<ShoppingCartIcon sx={{ fontSize: '0.8rem' }} />}
                                            onClick={(e) => handleAddToCart(product, e)}
                                            sx={{
                                                minHeight: '24px',
                                                height: '28px',
                                                backgroundColor: '#7B68EE',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#6A5ACD'
                                                },
                                                fontSize: '0.8rem',
                                                padding: '4px 8px',
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
