import { AppBar, Box, Container, Typography, InputBase, IconButton, Badge, Button, List, ListItem, ListItemText, Popover, CircularProgress, Alert, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ComputerIcon from '@mui/icons-material/Computer';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import InventoryIcon from '@mui/icons-material/Inventory';
import { styled, alpha } from '@mui/material/styles';
import boldtribeLogo from '../assets/BoldTribe_Logo-removebg-preview.png';
import { useState, useEffect, useCallback } from 'react';
import officeStationariesImg from '../assets/Office Stationaries.jpg';
import printAndDemandsImg from '../assets/Printing and Demands.jpg';
import itServicesImg from '../assets/itservices.jpg';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Login from '../pages/Login';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import bookMeetingRoomImg from '../assets/empty-business-meeting-conference-room-with-graphs-diagrams-tv-background.jpg';
import MenuIcon from '@mui/icons-material/Menu';
import Collapse from '@mui/material/Collapse';

// Create an image mapping object for only the three categories
const imageMapping = {
  'Office Stationaries.jpg': officeStationariesImg,
  'Printing and Demands.jpg': printAndDemandsImg,
  'itservices.jpg': itServicesImg,
  'meeting-room.jpg': bookMeetingRoomImg
};

// Styled search bar component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '50px',
  backgroundColor: alpha(theme.palette.common.white, 0.9),
  border: '2px solid #e0e0e0',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 1),
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    border: '2px solid #7B68EE',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '650px',
  transition: 'all 0.4s ease',
  '@media (max-width: 1200px)': {
    width: '550px',
  },
  '@media (max-width: 900px)': {
    width: '450px',
  },
  '@media (max-width: 600px)': {
    display: 'none',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#7B68EE',
  transition: 'all 0.3s ease',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#333',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: '12px 20px',
    width: '100%',
    fontSize: '16px',
    '&::placeholder': {
      color: '#666',
      opacity: 0.7,
    }
  },
}));

const Navbar = ({ selectedCategory, onCategoryChange, cartCount = 0, isLoggedIn, setIsLoggedIn }) => {
  // Replace the categories state with static data including icons
  const [categories] = useState([
    {
      _id: '1',
      name: 'Office Stationeries',
      image: 'Office Stationaries.jpg',
      icon: <InventoryIcon sx={{ fontSize: '1.2rem' }} />
    },
    {
      _id: '2',
      name: 'Print and Demands',
      image: 'Printing and Demands.jpg',
      icon: <LocalPrintshopIcon sx={{ fontSize: '1.2rem' }} />
    },
    {
      _id: '3',
      name: 'IT Services and Repair',
      image: 'itservices.jpg',
      icon: <ComputerIcon sx={{ fontSize: '1.2rem' }} />
    },
    {
      _id: '4',
      name: 'Book Meeting Room',
      image: 'meeting-room.jpg',
      icon: <MeetingRoomIcon sx={{ fontSize: '1.2rem' }} />
    }
  ]);

  // Remove loading state since we're using static data
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [anchorElSearch, setAnchorElSearch] = useState(null);
  const searchInputRef = React.useRef(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryChange = (categoryName, categoryId) => {
    onCategoryChange(categoryName, categoryId);
  };

  const handleCategoryClick = (category) => {
    handleCategoryChange(category.name, category._id);

    switch (category.name) {
        case 'Office Stationeries':
            navigate('/');
            break;
        case 'Print and Demands':
            navigate('/print-demands');
            break;
        case 'IT Services and Repair':
            navigate('/it-services');
            break;
        case 'Book Meeting Room':
            navigate('/book-meeting-room'); // Add this case
            break;
        default:
            navigate('/');
    }
  };

  const handleCartClick = () => {
    // Always navigate to cart, regardless of login status
    navigate('/cart');
  };

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('cart');
    
    // Update authentication state
    setIsLoggedIn(false);
    
    // Close the profile menu
    handleProfileMenuClose();
    
    // Redirect to home page
    navigate('/', { replace: true });
  };

  const handleProfileNavigate = () => {
    handleProfileMenuClose();
    // Check if user is logged in before navigating
    if (isLoggedIn) {
        try {
            // Get user data from localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                navigate('/profile', { state: { userData } });
            } else {
                console.error('No user data found');
                // Optionally show an error message to user
                setError('Please login again');
            }
        } catch (error) {
            console.error('Error navigating to profile:', error);
        }
    } else {
        // If not logged in, show login modal
        setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    navigate('/');
  };

  const handleLoginClick = () => {
    setAuthMode('login');
    setOpenAuthModal(false);
    setShowLoginModal(false);
    navigate('/login');
  };

  const handleRegisterClick = () => {
    setAuthMode('register');
    setOpenAuthModal(false);
    setShowLoginModal(false);
    navigate('/register');
  };

  // Debounce search function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchMessage('');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchMessage('');

    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8003';
      const response = await axios.get(`${baseURL}/api/services/search`, {
        params: { query: query.trim() }
      });

      if (response.data.success) {
        setSearchResults(response.data.data);
        if (response.data.data.length === 0) {
          setSearchMessage(response.data.message || 'Product not found');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Error performing search');
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Simplified search change handler
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setAnchorElSearch(event.currentTarget);
      debouncedSearch(query);
    } else {
      setSearchResults([]);
      setSearchMessage('');
      setAnchorElSearch(null);
    }
  };

  // Simplified debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        performSearch(query);
      }
    }, 300),
    []
  );

  // Keep input focused and allow continuous typing
  const handleInputFocus = (event) => {
    setIsFocused(true);
    // Don't set anchor element here to prevent popover from blocking typing
    if (searchInputRef.current) {
      const length = searchInputRef.current.value.length;
      searchInputRef.current.setSelectionRange(length, length);
    }
  };

  const handleSearchResultClick = (product) => {
    setSearchQuery('');
    setSearchResults([]);
    setAnchorElSearch(null);
    
    // Keep focus on search input after selection
    if (searchInputRef.current) {
        searchInputRef.current.focus();
    }

    // Navigate to the appropriate product details page based on category
    if (product.category === 'IT Services and Repair') {
      navigate(`/it-service/${product._id}`);
    } else if (product.category === 'Print and Demands') {
      navigate(`/print-demands/${product._id}`);
    } else {
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Container maxWidth="xl">
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          height: { xs: '80px', sm: '90px', md: '100px' },
        }}>
          {/* Logo */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flex: '0 0 auto',
            mr: { md: 15, lg: 25 },
          }}>
            <Box
              component="img"
              src={boldtribeLogo}
              alt='public\assets\Boldtribe brand kit.svg'
              onClick={() => navigate('/')}
              sx={{
                height: '120px',
                width: 'auto',
                cursor: 'pointer',
                objectFit: 'contain',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
          </Box>

          {/* Search Bar */}
          <Box sx={{
            display: { xs: 'none', sm: 'block' },
            flex: '0 0 auto',
            ml: { md: -12, lg: -16 },
            mr: { md: 2, lg: 4 },
          }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                inputRef={searchInputRef}
              />
            </Search>
          </Box>

          {/* Navigation Links */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 3,
            alignItems: 'center',
            flex: '1 1 auto',
            justifyContent: 'flex-end',
            mr: 4,
          }}>
            {categories.map((category) => (
              <Box
                key={category._id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <IconButton
                  onClick={() => handleCategoryClick(category)}
                  sx={{
                    color: selectedCategory === category.name ? '#7B68EE' : '#333',
                    backgroundColor: selectedCategory === category.name ? alpha('#7B68EE', 0.1) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha('#7B68EE', 0.1),
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.3s ease',
                    width: '40px',
                    height: '40px',
                  }}
                >
                  {category.icon}
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.7rem',
                    color: selectedCategory === category.name ? '#7B68EE' : '#666',
                    textAlign: 'center',
                    maxWidth: '80px',
                    lineHeight: 1.2,
                    fontWeight: selectedCategory === category.name ? 600 : 400,
                  }}
                >
                  {category.name}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Icons Section */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: '0 0 auto',
            height: '100%',
          }}>
            {/* Cart Icon */}
            <IconButton
              onClick={handleCartClick}
              sx={{
                color: '#fff',
                backgroundColor: '#7B68EE',
                '&:hover': {
                  backgroundColor: '#6A5ACD',
                },
                transition: 'all 0.3s ease',
                width: '40px',
                height: '40px',
                '& .MuiBadge-badge': {
                  top: 4,
                  right: 4,
                },
              }}
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon sx={{ fontSize: '1.2rem' }} />
              </Badge>
            </IconButton>

            {/* Profile Menu */}
            {isLoggedIn ? (
              <>
                <IconButton
                  onClick={handleProfileMenuClick}
                  sx={{
                    color: '#fff',
                    backgroundColor: '#7B68EE',
                    '&:hover': {
                      backgroundColor: '#6A5ACD',
                    },
                    transition: 'all 0.3s ease',
                    width: '40px',
                    height: '40px',
                  }}
                >
                  <AccountCircleIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                alignItems: 'center',
                height: '100%',
              }}>
                <Button
                  onClick={handleLoginClick}
                  startIcon={<LoginIcon sx={{ fontSize: '1.2rem' }} />}
                  variant="contained"
                  sx={{
                    backgroundColor: '#7B68EE',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#6A5ACD',
                    },
                    transition: 'all 0.3s ease',
                    height: '40px',
                    textTransform: 'none',
                    px: 3,
                    minWidth: '120px',
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                >
                  Login
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{
            display: { xs: 'block', md: 'none' },
            ml: 2,
            height: '100%',
            alignItems: 'center',
          }}>
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{
                color: '#fff',
                backgroundColor: '#7B68EE',
                '&:hover': {
                  backgroundColor: '#6A5ACD',
                },
                transition: 'all 0.3s ease',
                width: '40px',
                height: '40px',
              }}
            >
              <MenuIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Mobile Search Bar */}
        <Box sx={{
          display: { xs: 'block', sm: 'none' },
          px: 2,
          pb: 2,
        }}>
          <Search sx={{ width: '100%', display: 'block' }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              inputRef={searchInputRef}
            />
          </Search>
        </Box>

        {/* Mobile Menu */}
        <Collapse in={mobileMenuOpen}>
          <Box sx={{
            display: { xs: 'block', md: 'none' },
            px: 2,
            pb: 2,
            position: 'relative',
            overflow: 'visible',
            '& .MuiButton-root': {
              position: 'relative',
              overflow: 'visible',
              '&:hover .subcategory-box': {
                display: 'block',
                position: 'absolute',
                left: '100%',
                top: 0,
                zIndex: 1000,
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '8px',
                minWidth: '200px',
                maxHeight: '300px',
                overflowY: 'auto',
              },
            },
          }}>
            {categories.map((category) => (
              <Button
                key={category._id}
                onClick={() => {
                  handleCategoryClick(category);
                  setMobileMenuOpen(false);
                }}
                fullWidth
                startIcon={category.icon}
                sx={{
                  justifyContent: 'flex-start',
                  color: selectedCategory === category.name ? '#7B68EE' : '#333',
                  '&:hover': {
                    backgroundColor: alpha('#7B68EE', 0.1),
                  },
                  textTransform: 'none',
                  fontWeight: selectedCategory === category.name ? 'bold' : 'normal',
                  mb: 1,
                  position: 'relative',
                }}
              >
                {category.name}
                {category.name === 'IT Services and Repair' && (
                  <Box
                    className="subcategory-box"
                    sx={{
                      display: 'none',
                      position: 'absolute',
                      left: '100%',
                      top: 0,
                      zIndex: 1000,
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      padding: '8px',
                      minWidth: '200px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                    }}
                  >
                    <List>
                      <ListItem button>
                        <ListItemText primary="Laptop Repair" />
                      </ListItem>
                      <ListItem button>
                        <ListItemText primary="Desktop Repair" />
                      </ListItem>
                      <ListItem button>
                        <ListItemText primary="Printer Repair" />
                      </ListItem>
                      <ListItem button>
                        <ListItemText primary="Network Setup" />
                      </ListItem>
                    </List>
                  </Box>
                )}
              </Button>
            ))}
          </Box>
        </Collapse>
      </Container>
    </AppBar>
  );
};

export default Navbar;