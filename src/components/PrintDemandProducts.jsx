import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import business_card from "../assets/Business Cards.jpg"
const PrintDemandProducts = ({ selectedCategory, onAddToCart }) => {
    const navigate = useNavigate();

    // Static products data organized by subcategories
    const staticProducts = [
        // Business Cards
        {
            _id: '1',
            productName: 'Premium Business Cards',
            price: 499,
            rating: 5,
            offers: '15% OFF',
            images: ['/images/business-card-1.jpg'],
            subCategory: 'Business Cards',
            fullImageUrl: '/assets/businesscard.avif'
        },
        {
            _id: '2',
            productName: 'Matte Finish Business Cards',
            price: 399,
            rating: 4,
            offers: '10% OFF',
            images: ['/images/business-card-2.jpg'],
            subCategory: 'Business Cards',
            fullImageUrl: '/assets/matte.jpg'
        },

        // Banners & Posters
        {
            _id: '3',
            productName: 'Large Format Banner',
            price: 1499,
            rating: 4,
            offers: '20% OFF',
            images: ['/images/banner-1.jpg'],
            subCategory: 'Banners & Posters',
            fullImageUrl: '/assets/banner.jpg'
        },
        {
            _id: '4',
            productName: 'Event Poster Pack',
            price: 899,
            rating: 5,
            offers: '25% OFF',
            images: ['/images/poster-1.jpg'],
            subCategory: 'Banners & Posters',
            fullImageUrl: '/assets/poster.jpg'
        },

        // Marketing Materials
        {
            _id: '5',
            productName: 'Brochure Design & Print',
            price: 799,
            rating: 4,
            offers: '15% OFF',
            images: ['/images/brochure-1.jpg'],
            subCategory: 'Marketing Materials',
            fullImageUrl: '/assets/brochure.webp'
        },
        {
            _id: '6',
            productName: 'Flyer Package',
            price: 599,
            rating: 4,
            offers: '30% OFF',
            images: ['/images/flyer-1.jpg'],
            subCategory: 'Marketing Materials',
            fullImageUrl: '/assets/flyer.jpg'
        },

        // Printing Products
        {
            _id: '7',
            productName: 'Custom T-Shirt Printing',
            price: 699,
            rating: 5,
            offers: '10% OFF',
            images: ['/images/tshirt-1.jpg'],
            subCategory: 'Printing Products',
            fullImageUrl: '/assets/tshirt.webp'
        },
        {
            _id: '8',
            productName: 'Custom Mug Printing',
            price: 299,
            rating: 4,
            offers: '20% OFF',
            images: ['/images/mug-1.jpg'],
            subCategory: 'Printing Products',
            fullImageUrl: '/assets/mug.jpg'
        }
    ];

    // Filter products based on selected subcategory
    const filteredProducts = selectedCategory 
        ? staticProducts.filter(product => product.subCategory === selectedCategory)
        : staticProducts;

    const formatOffer = (offer) => {
        if (!offer) return '';
        const cleanOffer = offer.replace(/off/i, '').trim();
        const numberOnly = cleanOffer.replace(/%/g, '').trim();
        return `${numberOnly}% OFF`;
    };

    const handleProductClick = (product) => {
        navigate(`/print-demand-product/${product._id}`, { 
            state: { 
                product: {
                    ...product,
                    category: 'Print and Demands',
                    subCategory: selectedCategory
                }
            } 
        });
    };

    return (
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
                        color: '#333',
                        fontSize: '1.5rem'
                    }}>
                        PRINT AND DEMANDS
                    </Typography>

                    {selectedCategory && (
                        <Typography variant="h5" sx={{
                            fontWeight: 'bold',
                            color: '#7B68EE',
                            mb: 2,
                            mt: 1,
                            fontSize: '1.25rem'
                        }}>
                            {selectedCategory.toUpperCase()} PRODUCTS
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
                                        // onError={(e) => {
                                        // //     e.target.onerror = null;
                                        // //     e.target.src = '/images/default-product.jpg';
                                        // // }}
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
                                            onAddToCart(product);
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
    );
};

export default PrintDemandProducts;