import { Box, Container, Typography, Grid, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import boldtribeLogo from '../assets/BoldTribe_Logo-removebg-preview.png';
import logo from '../assets/BoldTribe_Logo-2-removebg-preview.png';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFTemplate from './PDFTemplate';
import { Link } from '@mui/material';

const Footer = () => {
    const getPolicyContent = (policyType) => {
        const policies = {
            'Terms of Use': {
                title: 'Terms & Conditions for BoldServe',
                content: `Welcome to BoldServe! By using our services, you agree to the following terms and conditions. Please read them carefully before using our platform.

1. Introduction
These Terms & Conditions govern your use of BoldServe, including our website, mobile application, and services. By accessing our platform, you agree to comply with these terms.

2. Services Offered
BoldServe provides office supplies, custom printing, IT services, and inventory solutions tailored for businesses and corporate clients.

3. User Responsibilities
Users must provide accurate business information when placing an order.
Unauthorized use of our platform is strictly prohibited.
Users must comply with all applicable laws and regulations in Odisha.

4. Payment & Pricing
All prices are subject to change without prior notice.
Payment must be made through authorized payment methods.
In case of non-payment or fraudulent transactions, services may be suspended.

5. Order Acceptance & Cancellation
Orders are subject to acceptance and availability.
We reserve the right to cancel any order due to unforeseen circumstances.

6. Liability & Disclaimers
We are not liable for any direct or indirect damages arising from the use of our services.
BoldServe is not responsible for third-party service failures.

7. Governing Law
These Terms & Conditions are governed by the laws of Odisha, India. Any disputes shall be subject to the jurisdiction of the courts in Bhubaneswar.

Contact BoldServe
For any queries, reach out to us at:
Email: support@boldtribe.in
Phone: +91 76848 36139
Address: DCB 630, DLF CyberCity, Bhubaneswar, Odisha, India-751024

1. Eligibility
Refunds are applicable only for orders that meet the following criteria:
- Incorrect or defective office supplies or IT products...`
            },
            'Return Policy': {
                title: 'Return Policy for BoldServe',
                content: `Refund Policy for BoldServe

1. Eligibility
Refunds are applicable only for orders that meet the following criteria:
- Incorrect or defective office supplies or IT products...`
            },
            'Shipping Policy': {
                title: 'Shipping Policy for BoldServe',
                content: `Shipping Policy for BoldServe

1. Delivery Timelines
Orders will be delivered within the estimated timeframe displayed during checkout...`
            },
            'Cancellation Policy': {
                title: 'Cancellation Policy for BoldServe',
                content: `Cancellation Policy for BoldServe

1. Order Cancellation
Orders can be canceled within 24 hours of placement...`
            },
            'Privacy Policy': {
                title: 'Privacy Policy for BoldServe',
                content: `Privacy Policy for BoldServe...`
            },
            'Cookie Policy': {
                title: 'Cookie Policy for BoldServe',
                content: `Cookie Policy for BoldServe...`
            },
            'Data Protection': {
                title: 'Data Protection Policy for BoldServe',
                content: `Data Protection Policy...`
            },
            'Security Policy': {
                title: 'Security Policy for BoldServe',
                content: `Security Policy...`
            }
        };
        return policies[policyType];
    };

    const handlePolicyClick = (policyType) => {
        const policyData = getPolicyContent(policyType);
        return (
            <PDFDownloadLink
                document={
                    <PDFTemplate 
                        title={policyData.title}
                        content={policyData.content}
                    />
                }
                fileName={`${policyType.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                {({ blob, url, loading, error }) => 
                    loading ? 'Loading...' : policyType
                }
            </PDFDownloadLink>
        );
    };

    const [openModal, setOpenModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const handleOpen = (policyType) => {
        setSelectedPolicy(getPolicyContent(policyType));
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedPolicy(null);
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 800,
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        overflow: 'auto',
        borderRadius: 2,
    };

    // Replace handlePolicyClick with this:
    const renderPolicyLink = (policyType) => (
        <Typography
            onClick={() => handleOpen(policyType)}
            sx={{
                color: policyType === 'Terms of Use' ? 'black' : '#666',
                cursor: 'pointer',
                '&:hover': { color: '#7B68EE' },
                textDecoration: 'none'
            }}
        >
            {policyType}
        </Typography>
    );

    return (
        <>
            <Box
                component="footer"
                sx={{
                    backgroundColor: '#ECECFF',
                    py: 4,
                    borderTop: '1px solid #e0e0e0',
                    width: '100%',
                    position: 'relative',
                    bottom: 0,
                    left: 0,
                    zIndex: 1000,
                }}
            >
                <Container maxWidth="xl">
                    <Grid container spacing={4} sx={{ mb: 4 }}>
                        {/* Left Section - Logo and Address */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                alignItems: 'flex-start',
                                position: 'relative',
                                paddingTop: '20px'
                            }}>
                                <img
                                    src={boldtribeLogo}
                                    alt="BoldServe Logo"
                                    style={{
                                        height: '180px',
                                        width: 'auto',
                                        objectFit: 'contain',
                                        marginLeft: '-6px'
                                    }}
                                />

                                <Box sx={{ textAlign: 'left', marginTop: '-40px' }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 'bold', color: '#333', mb: 1, marginLeft: '8px' }}
                                    >
                                        Contact Us:-
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', mb: 1, marginLeft: '8px' }}>
                                        DLF Cybercity, IDCO Tech park,
                                        <br />
                                        Patia, Bhubaneswar
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', marginLeft: '8px' }}>
                                        Mobile: +91 9876543210
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Middle Section - Terms and Conditions */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2, color: 'black', mt: 2 }}>
                                Terms & Conditions
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: 'black',
                                        cursor: 'pointer',
                                        '&:hover': { color: '#7B68EE' }
                                    }}
                                >
                                    {renderPolicyLink('Terms of Use')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}
                                >
                                    {handlePolicyClick('Return Policy')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}
                                >
                                    {handlePolicyClick('Shipping Policy')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}
                                >
                                    {handlePolicyClick('Cancellation Policy')}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Right Section - Privacy Policy */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#333', mt: 2 }}>
                                Privacy & Policy
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}
                                >
                                    {handlePolicyClick('Privacy Policy')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}
                                >
                                    {handlePolicyClick('Cookie Policy')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}
                                >
                                    {handlePolicyClick('Data Protection')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}
                                >
                                    {handlePolicyClick('Security Policy')}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Copyright Section */}
                    <Box
                        sx={{
                            borderTop: '1px solid #e0e0e0',
                            pt: 2,
                            mt: 2,
                            textAlign: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1
                            }}
                        >
                            <Box
                                component="img"
                                src={logo}
                                alt="BoldTribe Logo"
                                sx={{
                                    height: '50px',
                                    width: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                © {new Date().getFullYear()} All Rights Reserved by BoldTribe Innovations Private Limited
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="policy-modal-title"
            >
                <Box sx={modalStyle}>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <img
                            src={boldtribeLogo}
                            alt="BoldServe Logo"
                            style={{
                                height: '100px',
                                width: 'auto',
                                objectFit: 'contain'
                            }}
                        />
                    </Box>

                    {selectedPolicy && (
                        <>
                            <Typography
                                id="policy-modal-title"
                                variant="h5"
                                component="h2"
                                sx={{ 
                                    textAlign: 'center',
                                    mb: 3,
                                    fontWeight: 'bold'
                                }}
                            >
                                {selectedPolicy.title}
                            </Typography>
                            <Typography
                                sx={{
                                    whiteSpace: 'pre-line',
                                    lineHeight: 1.6,
                                    color: '#333'
                                }}
                            >
                                {selectedPolicy.content}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default Footer;