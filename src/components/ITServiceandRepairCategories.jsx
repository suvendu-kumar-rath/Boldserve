import { Box, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Import IT Services images
import computerRepairImg from '../assets/computer Reapir.jpg';
import softwareImg from '../assets/Software Supports.jpg';
import networkingImg from '../assets/networking.jpg';
import securityImg from '../assets/securityImage.jpg';
import upgradeImg from '../assets/Hardware.jpg';
import consultingImg from '../assets/consultationImage.jpg';

// Define IT Services subcategories with their images
const itServicesSubcategories = {
    'Computer & Laptop Repair': computerRepairImg,
    'Software & OS Support': softwareImg,
    'Server & Networking Solutions': networkingImg,
    'IT Security & Cybersecurity Solutions': securityImg,
    'Upgradation & Hardware Enhancement': upgradeImg,
    'IT Consultation & AMC Services': consultingImg
};

const ITServiceandRepairCategories = ({ selectedSubCategory, onSubCategorySelect = () => {} }) => {
    // Add default handler if onSubCategorySelect is not provided
    const handleSubCategorySelect = (name) => {
        if (onSubCategorySelect) {
            onSubCategorySelect(name);
        }
    };

    return (
        <Box sx={{ 
            py: 3, 
            backgroundColor: '#EAEAEA',
            height: '168px',
            width: '100%',
        }}>
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: 4,
                        px: 3,
                        justifyContent: 'center',
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                    }}
                >
                    {Object.entries(itServicesSubcategories).map(([name, image]) => (
                        <Box
                            key={name}
                            onClick={() => handleSubCategorySelect(name)}
                            sx={{
                                padding: '12px 24px',
                                cursor: 'pointer',
                                borderRadius: '25px',
                                transition: 'all 0.3s ease',
                                backgroundColor: selectedSubCategory === name 
                                    ? 'rgba(0, 0, 0, 0.05)' 
                                    : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            <div style={{
                                width: '100px',
                                height: '100px',
                                margin: '0 auto',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                                border: selectedSubCategory === name ? '2px solid #1976d2' : 'none',
                                boxShadow: selectedSubCategory === name 
                                    ? '0px 4px 8px rgba(0, 0, 0, 0.1)' 
                                    : 'none'
                            }}>
                                <img
                                    src={image}
                                    alt={name}
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                            <Typography 
                                variant="body2" 
                                align="center"
                                sx={{ 
                                    fontSize: '1rem',
                                    fontWeight: selectedSubCategory === name ? 600 : 500,
                                    whiteSpace: 'normal',
                                    textAlign: 'center',
                                    color: selectedSubCategory === name ? '#1976d2' : 'inherit',
                                    mt: 1
                                }}
                            >
                                {name}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default ITServiceandRepairCategories;