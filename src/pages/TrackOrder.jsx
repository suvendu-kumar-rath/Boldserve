import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Card, CardContent,
    Stepper, Step, StepLabel, Button
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LocalShipping, Payment, Inventory,
    CheckCircle, Home
} from '@mui/icons-material';

const TrackOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderDetails = location.state;

    const steps = [
        {
            label: 'Order Placed',
            icon: <Payment />,
            description: 'Your order has been placed successfully'
        },
        {
            label: 'Processing',
            icon: <Inventory />,
            description: 'Your order is being processed'
        },
        {
            label: 'Shipped',
            icon: <LocalShipping />,
            description: 'Your order is on the way'
        },
        {
            label: 'Delivered',
            icon: <CheckCircle />,
            description: 'Your order has been delivered'
        }
    ];

    // For demo, you can replace this with actual order status from backend
    const [activeStep, setActiveStep] = useState(1);

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Card sx={{ 
                background: 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
                color: 'white',
                mb: 4 
            }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Track Your Order
                    </Typography>
                    
                    <Box sx={{ width: '100%', mt: 4 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel
                                        StepIconComponent={() => (
                                            <Box
                                                sx={{
                                                    color: index <= activeStep ? 'white' : 'rgba(255,255,255,0.5)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {step.icon}
                                            </Box>
                                        )}
                                    >
                                        <Typography sx={{ color: 'white' }}>
                                            {step.label}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            {step.description}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<Home />}
                            onClick={() => navigate('/')}
                            sx={{
                                bgcolor: 'white',
                                color: '#9708CC',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)'
                                }
                            }}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default TrackOrder;