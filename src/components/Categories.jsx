import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import React from 'react';
import { Box } from '@mui/material';

// Import Office Stationaries images
import notebooksImage from '../assets/notebook.jpg';
import adhesiveImage from '../assets/Adhesive & Glue.jpg';
import penPencilImage from '../assets/penpencilekit.jpg';
import whitenerImage from '../assets/whitenerandmarker.jpg';
import staplerImage from '../assets/staplerandScissor.jpg';
import calculatorImage from '../assets/Calculators.jpg';

// Define Office Stationaries subcategories with their images
const officeStationariesSubcategories = {
    'Notebooks & Papers': notebooksImage,
    'Adhesive and Glue': adhesiveImage,
    'Pen & Pencil Kit': penPencilImage,
    'Whitener & Marker': whitenerImage,
    'Stapler & Scissors': staplerImage,
    'Calculator': calculatorImage,
};

const Categories = ({ selectedSubCategory, onSubCategorySelect }) => {
    return (
        <div style={{ 
            backgroundColor: '#EAEAEA', 
            height: '168px', 
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            marginTop: '20px'
        }}>
            <div style={{
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                padding: '20px 0',
                width: '100%'
            }}>
                <Grid container sx={{ 
                    display: 'inline-flex', 
                    flexWrap: 'nowrap',
                    px: 3,
                    justifyContent: 'center',
                    gap: 4
                }}>
                    {Object.entries(officeStationariesSubcategories).map(([name, image]) => (
                        <Grid item key={name}>
                            <Box
                                sx={{
                                    padding: '12px 24px',
                                    cursor: 'pointer',
                                    borderRadius: '25px',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: selectedSubCategory === name 
                                        ? 'rgba(0, 0, 0, 0.05)' 
                                        : 'transparent',
                                    boxShadow: selectedSubCategory === name 
                                        ? '0 4px 15px rgba(0, 0, 0, 0.15)' 
                                        : 'none',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                                onClick={() => onSubCategorySelect(name)}
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
                                    <CardMedia
                                        component="img"
                                        image={image}
                                        alt={name}
                                        sx={{ 
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                                <CardContent sx={{ 
                                    padding: '10px 0',
                                    '&:last-child': { pb: 0 }
                                }}>
                                    <Typography 
                                        variant="body2" 
                                        align="center"
                                        sx={{ 
                                            fontSize: '1rem',
                                            fontWeight: selectedSubCategory === name ? 600 : 500,
                                            whiteSpace: 'normal',
                                            textAlign: 'center',
                                            color: selectedSubCategory === name ? '#1976d2' : 'inherit'
                                        }}
                                    >
                                        {name}
                                    </Typography>
                                </CardContent>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
};

export default Categories;