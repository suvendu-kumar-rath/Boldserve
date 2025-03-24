import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button,
    Card, CardContent
} from '@mui/material';
import { Error } from '@mui/icons-material';

const OrderFailed = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" sx={{ my: 4 }}>
            <Card sx={{ 
                background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)',
                color: 'white'
            }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Error sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Payment Failed
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        We couldn't process your payment. Please try again.
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            sx={{ 
                                bgcolor: 'white',
                                color: '#FF416C',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)'
                                }
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default OrderFailed;