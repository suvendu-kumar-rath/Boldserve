import { Box, Container, Typography } from '@mui/material';
import { useEffect } from 'react';

// Import Print and Demands images
import businessCardsImg from '../assets/Business Cards.jpg';
import bannersImg from '../assets/Banners.jpg';
import marketingImg from '../assets/marker.jpg';
import printingImg from '../assets/Printing and Demands.jpg';

// Define Print and Demands subcategories with their images
const printDemandSubcategories = {
    'Business Cards': businessCardsImg,
    'Banners & Posters': bannersImg,
    'Marketing Materials': marketingImg,
    'Printing Products': printingImg
};

const PrintDemandCategories = ({ selectedSubCategory, onSubCategorySelect }) => {
    // Set Business Cards as default when component mounts
    useEffect(() => {
        if (!selectedSubCategory) {
            onSubCategorySelect('Business Cards');
        }
    }, [selectedSubCategory, onSubCategorySelect]);

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
                    {Object.entries(printDemandSubcategories).map(([name, image]) => (
                        <Box
                            key={name}
                            onClick={() => onSubCategorySelect(name)}
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
                                border: selectedSubCategory === name ? '2px solid #7B68EE' : 'none',
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
                                    color: selectedSubCategory === name ? '#7B68EE' : 'inherit',
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

export default PrintDemandCategories;