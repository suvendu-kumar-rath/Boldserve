import { Box, Button, Container, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ITServiceandRepiarProducts = ({ selectedCategory, onAddToCart }) => {
    const navigate = useNavigate();
    
    console.log('Component Rendered'); // Add this debug log

    // Static products data
    const staticProducts = [
        {
            _id: '1',
            productName: 'Laptop Repair Service',
            price: 499,
            rating: 5,
            offers: '15% OFF',
            images: ['/images/laptop-repair.jpg'],
            subCategory: 'Computer & Laptop Repair',
            fullImageUrl: '/assets/computer.avif'
        },
        {
            _id: '2',
            productName: 'Windows OS Installation',
            price: 799,
            rating: 4,
            offers: '10% OFF',
            images: ['/images/software-support.jpg'],
            subCategory: 'Software & OS Support',
            fullImageUrl: '/assets/osinstall.webp'
        },
        {
            _id: '3',
            productName: 'Network Setup & Configuration',
            price: 1499,
            rating: 4,
            offers: '5% OFF',
            images: ['/images/network-setup.jpg'],
            subCategory: 'Server & Networking Solutions',
            fullImageUrl: '/assets/networksetup.avif'
        },
        {
            _id: '4',
            productName: 'Antivirus & Security Setup',
            price: 1999,
            rating: 5,
            offers: '20% OFF',
            images: ['/images/security.jpg'],
            subCategory: 'IT Security & Cybersecurity Solutions',
            fullImageUrl: '/assets/antivirus.webp'
        },
        {
            _id: '5',
            productName: 'RAM & Storage Upgrade',
            price: 2499,
            rating: 5,
            offers: '25% OFF',
            images: ['/images/hardware-upgrade.jpg'],
            subCategory: 'Upgradation & Hardware Enhancement',
            fullImageUrl: '/assets/ram-upgrade.jpg'
        },
        {
            _id: '6',
            productName: 'Annual Maintenance Contract',
            price: 1299,
            rating: 4,
            offers: '10% OFF',
            images: ['/images/amc.jpg'],
            subCategory: 'IT Consultation & AMC Services',
            fullImageUrl: '/assets/annualmaintenance.png'
        }
    ];

    // Filter products based on selected category or show all if no category selected
    const filteredProducts = selectedCategory 
        ? staticProducts.filter(product => product.subCategory === selectedCategory)
        : staticProducts;

    // Add debug logs
    console.log('Selected Category:', selectedCategory);
    console.log('Static Products:', staticProducts);
    console.log('Filtered Products:', filteredProducts);

    const formatOffer = (offer) => {
        if (!offer) return '';
        const cleanOffer = offer.replace(/off/i, '').trim();
        const numberOnly = cleanOffer.replace(/%/g, '').trim();
        return `${numberOnly}% OFF`;
    };

    const handleProductClick = (product) => {
        navigate(`/it-service/${product._id}`, { 
            state: { 
                product: {
                    ...product,
                    category: 'IT Services',
                    subCategory: product.subCategory
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
                        IT SERVICES AND REPAIR
                    </Typography>

                    {selectedCategory && (
                        <Typography variant="h5" sx={{
                            fontWeight: 'bold',
                            color: '#7B68EE',
                            mb: 2,
                            mt: 1,
                            fontSize: '1.25rem'
                        }}>
                            {selectedCategory.toUpperCase()} SERVICES
                        </Typography>
                    )}

                    <Box sx={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '0',
                        right: '0',
                        height: '2px',
                        '&::after': {
                            // content: '""',
                            // position: 'absolute',
                            top: '0',
                            left: '0',
                            right: '0',
                            height: '2px',
                            background: '#000',
                            borderRadius: '100%',
                            transform: 'scaleY(0.5)'
                        }
                    }} />
                </Box>

                <Grid container spacing={3} sx={{ py: 6 }}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}> {/* Updated grid sizing */}
                                <Paper
                                    elevation={2}
                                    onClick={() => handleProductClick(product)}
                                    sx={{
                                        p: 2, // Increased padding
                                        minWidth: '200px', // Added minimum width
                                        height: '300px', // Increased height
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        },
                                        overflow: 'visible',
                                        cursor: 'pointer',
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
                                            {product.offers}
                                        </Box>
                                    )}

                                    <Box sx={{ position: 'relative', height: '200px', mb: 2 }}> {/* Increased image container height */}
                                        <img
                                            src={product.fullImageUrl || '/images/default-product.jpg'} // Updated image path
                                            alt={product.productName}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover', // Changed to cover
                                                backgroundColor: '#fff',
                                                display: 'block',
                                                margin: '0 auto'
                                            }}
                                            // onError={(e) => {
                                            //     e.target.onerror = null;
                                            //     e.target.src = '/images/default-product.jpg';
                                            // }}
                                        />
                                    </Box>

                                    <Box sx={{ 
                                        flex: 1, 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        height: 'calc(300px - 200px - 16px)'
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
                                            startIcon={<BookOnlineIcon sx={{ fontSize: '0.8rem' }} />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddToCart(product);
                                            }}
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
                                            Book Now
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ textAlign: 'center' }}>
                                No products available for this category
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default ITServiceandRepiarProducts;