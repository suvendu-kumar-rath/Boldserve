import { AppBar, Box, Container, Typography, InputBase, IconButton, Badge, Button, List, ListItem, ListItemText, Popover, CircularProgress, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
  width: '400px',
  transition: 'all 0.4s ease',
  '@media (max-width: 1200px)': {
    width: '350px',
  },
  '@media (max-width: 900px)': {
    width: '300px',
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
  // Replace the categories state with static data
  const [categories] = useState([
    {
      _id: '1',
      name: 'Office Stationeries',
      image: 'Office Stationaries.jpg'
    },
    {
      _id: '2',
      name: 'Print and Demands',
      image: 'Printing and Demands.jpg'
    },
    {
      _id: '3',
      name: 'IT Services and Repair',
      image: 'itservices.jpg'
    },
    {
      _id: '4',
      name: 'Book Meeting Room',
      image: 'meeting-room.jpg'
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
    if (!isLoggedIn) {
      setOpenAuthModal(true);
    } else {
      navigate('/cart');
    }
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
    setShowLoginModal(true);
  };

  const handleRegisterClick = () => {
    setAuthMode('register');
    setOpenAuthModal(false);
    setShowLoginModal(true);
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
    <>
      <AppBar position="static" sx={{ backgroundColor: '#ECECFF', boxShadow: 'none' }}>
        <Container maxWidth="xl">
          <Box
            py={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            {/* Logo */}
            <Box sx={{ flex: '0 0 200px' }}>
              <Typography 
                variant="h6" 
                component="div" 
                onClick={() => navigate('/')}
                sx={{ cursor: 'pointer' }}
              >
                <img
                  src={boldtribeLogo}
                  alt="BoldServe Logo"
                  style={{
                    height: '180px',
                    width: '180px',
                    cursor: 'pointer'
                  }}
                />
              </Typography>
            </Box>

            {/* Center Container for Search and Categories */}
            <Box sx={{
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              {/* Updated Search Bar with improved typing support */}
              <Search>
                <StyledInputBase
                  inputRef={searchInputRef}
                  placeholder="Search for products..."
                  inputProps={{ 
                    'aria-label': 'search',
                    autoComplete: 'off',
                    spellCheck: 'false'
                  }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleInputFocus}
                  onBlur={() => setIsFocused(false)}
                  sx={{
                    '& input': {
                      cursor: 'text',
                      caretColor: '#7B68EE',
                    }
                  }}
                />
                <SearchIconWrapper>
                  {isSearching ? (
                    <CircularProgress size={20} />
                  ) : searchQuery ? (
                    <CloseIcon 
                      sx={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault();
                        setSearchQuery('');
                        setSearchResults([]);
                        setSearchMessage('');
                        if (searchInputRef.current) {
                          searchInputRef.current.focus();
                        }
                      }}
                    />
                  ) : (
                    <SearchIcon />
                  )}
                </SearchIconWrapper>
              </Search>

              {/* Categories */}
              <Box sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center'
              }}>
                {categories.map((category) => (
                  <Box
                    key={category._id}
                    onClick={() => handleCategoryClick(category)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transform: selectedCategory === category.name ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      padding: '6px',
                      borderRadius: '12px',
                      backgroundColor: selectedCategory === category.name
                        ? 'rgba(123, 104, 238, 0.1)'
                        : 'transparent',
                    }}
                  >
                    <Box
                      sx={{
                        width: 55,
                        height: 55,
                        borderRadius: '50%',
                        border: selectedCategory === category.name
                          ? '3px solid #7B68EE'
                          : '2px solid #ff4444',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        boxShadow: selectedCategory === category.name
                          ? '0 4px 15px rgba(123, 104, 238, 0.5)'
                          : 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(123, 104, 238, 0.3)',
                          border: '2px solid #7B68EE',
                        }
                      }}
                    >
                      <img
                        src={imageMapping[category.image]}
                        alt={category.name}
                        style={{
                          width: '65%',
                          height: '65%',
                          objectFit: 'contain',
                          filter: selectedCategory === category.name
                            ? 'brightness(1.1)'
                            : 'brightness(1)',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        textAlign: 'center',
                        color: selectedCategory === category.name ? '#7B68EE' : '#555',
                        fontSize: '0.75rem',
                        fontWeight: selectedCategory === category.name ? '600' : '500',
                        transition: 'all 0.3s ease',
                        textShadow: selectedCategory === category.name
                          ? '0 0 1px rgba(123, 104, 238, 0.2)'
                          : 'none',
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Cart and Profile Icons */}
            <Box sx={{
              flex: '0 0 auto',
              display: 'flex',
              gap: 3,
            }}>
              <IconButton
                sx={{
                  color: 'black',
                  padding: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.05)',
                  }
                }}
                aria-label="cart"
                onClick={handleCartClick}
              >
                <Badge badgeContent={isLoggedIn ? cartCount : 0} color="error">
                  <ShoppingCartIcon sx={{ fontSize: 28 }} />
                </Badge>
              </IconButton>

              <IconButton
                onClick={handleProfileMenuClick}
                sx={{
                  color: 'black',
                  padding: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.05)',
                  }
                }}
                aria-label="profile"
              >
                <AccountCircleIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </AppBar>

      {/* Auth Modal */}
      <Dialog
        open={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Welcome to BoldServe</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
            Please login or register to continue
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleLoginClick}
            sx={{
              backgroundColor: '#7B68EE',
              '&:hover': { backgroundColor: '#6A5ACD' }
            }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            onClick={handleRegisterClick}
            sx={{
              borderColor: '#7B68EE',
              color: '#7B68EE',
              '&:hover': { borderColor: '#6A5ACD' }
            }}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* Login/Register Modal */}
      <Login
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
        initialMode={authMode}
      />

      {/* Profile Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isLoggedIn ? (
          // Menu items for logged-in users
          [
            <MenuItem key="profile" onClick={handleProfileNavigate} sx={{ minWidth: 200 }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: '#7B68EE' }} />
              </ListItemIcon>
              Profile
            </MenuItem>,
            <MenuItem 
              key="logout" 
              onClick={handleLogout}  // Updated to use handleLogout
              sx={{ minWidth: 200 }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#7B68EE' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          ]
        ) : (
          // Menu items for non-logged-in users
          [
            <MenuItem key="login" onClick={handleLoginClick} sx={{ minWidth: 200 }}>
              <ListItemIcon>
                <LoginIcon fontSize="small" sx={{ color: '#7B68EE' }} />
              </ListItemIcon>
              Login
            </MenuItem>,
            <MenuItem key="register" onClick={handleRegisterClick} sx={{ minWidth: 200 }}>
              <ListItemIcon>
                <HowToRegIcon fontSize="small" sx={{ color: '#7B68EE' }} />
              </ListItemIcon>
              Register
            </MenuItem>
          ]
        )}
      </Menu>

      {/* Updated Search Results Popover */}
      <Popover
        open={Boolean(anchorElSearch) && searchQuery.trim() && (searchResults.length > 0 || searchMessage)}
        anchorEl={anchorElSearch}
        onClose={() => {
          setAnchorElSearch(null);
          // Keep focus in the input
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 400,
            mt: 1,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxHeight: '400px',
            overflowY: 'auto'
          }
        }}
      >
        {searchMessage ? (
          <Alert severity="info" sx={{ m: 1 }}>
            {searchMessage}
          </Alert>
        ) : (
          <List>
            {searchResults.map((product) => (
              <ListItem 
                key={product._id}
                onClick={() => handleSearchResultClick(product)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { 
                    backgroundColor: 'rgba(123, 104, 238, 0.1)' 
                  }
                }}
              >
                <ListItemText
                  primary={product.productName}
                  secondary={`${product.category} - ${product.subCategory}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
};

export default Navbar;