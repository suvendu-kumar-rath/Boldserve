import React from 'react';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Categories from './components/Categories';
import Products from './components/Products';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrintDemandCategories from './components/PrintDemandCategories';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import PrintDemandProducts from './components/PrintDemandProducts';
import ITServiceandRepairCategories from './components/ITServiceandRepairCategories';
import ITServiceandRepiarProducts from './components/ITServiceandRepiarProducts';
import ProductDetails from './components/ProductDetails';
import PrintDemandProductDetails from './components/PrintDemandProductDetails';
import ITServiceProductDetails from './components/ITServiceProductDetails';
import Cart from './components/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import OrderFailed from './pages/OrderFailed';
import TrackOrder from './pages/TrackOrder';
import BookMeetingRoom from './components/BookMeetingRoom';
import { AuthProvider } from './Context/Context';


function App() {
  const [selectedCategory, setSelectedCategory] = useState('Office Stationeries');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Notebooks & Papers');
  const [selectedPrintDemandCategory, setSelectedPrintDemandCategory] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedITServiceCategory, setSelectedITServiceCategory] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState('login');
  const [pendingCartProduct, setPendingCartProduct] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Load cart from localStorage
    loadCart();

    // Always redirect to home page on refresh
    if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) {
        window.location.href = '/';
    }

    // Set default states for home page
    setSelectedCategory('Office Stationeries');
    setSelectedSubCategory('Notebooks & Papers');
    setSelectedCategoryId(1);
    setSelectedPrintDemandCategory('');
    setSelectedITServiceCategory('');

    // Initialize cart count from localStorage when app loads
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartCount(parsedCart.length);
    }
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        setCartCount(parsedCart.length);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // Reset cart if there's an error
      localStorage.removeItem('cart');
      setCart([]);
      setCartCount(0);
    }
  };

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...existingCart, { ...product, quantity: 1 }];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
  };

  const handleLoginStateChange = (loggedIn) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      // Reload cart after login
      loadCart();
    } else {
      // Clear cart on logout
      setCart([]);
      setCartCount(0);
      localStorage.removeItem('cart');
    }
  };

  const handleCategoryChange = (categoryName, categoryId) => {
    setSelectedCategory(categoryName);
    setSelectedCategoryId(categoryId);
    
    // Reset all category states first
    setSelectedSubCategory('');
    setSelectedPrintDemandCategory('');
    setSelectedITServiceCategory('');
    
    // Set initial subcategory based on category
    switch (categoryName) {
      case 'Office Stationeries':
        setSelectedSubCategory('Notebooks & Papers');
        break;
      case 'Print and Demands':
        setSelectedPrintDemandCategory('Business Cards');
        break;
      case 'IT Services and Repair':
        setSelectedITServiceCategory('Computer & Laptop Repair');
        break;
      default:
        break;
    }
  };

  const handleSubCategorySelect = (subCategoryName) => {
    console.log('Selected SubCategory:', subCategoryName);
    setSelectedSubCategory(subCategoryName);
  };

  const handlePrintDemandCategorySelect = (category) => {
    console.log('Selected Print and Demand Category:', category);
    setSelectedPrintDemandCategory(category);
  };

  const handleITServiceCategorySelect = (category) => {
    console.log('Selected IT Service Category:', category);
    setSelectedITServiceCategory(category);
  };

  const handleLoginSuccess = (user) => {
    handleLoginStateChange(true);
    setLoginModalOpen(false);
    
    // Store user data in localStorage if not already done
    if (user) {
        localStorage.setItem('userData', JSON.stringify(user));
    }
    
    // Add pending product to cart if exists
    if (pendingCartProduct) {
        handleAddToCart(pendingCartProduct);
        setPendingCartProduct(null);
    }
};

  const handleCartUpdate = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#FFFFFF'
          }}>
            <Navbar
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              cartCount={cartCount}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={handleLoginStateChange}
            />

            {/* Add Login Modal */}
            <Login 
              open={loginModalOpen}
              onClose={() => {
                setLoginModalOpen(false);
                setPendingCartProduct(null);
              }}
              onLogin={handleLoginSuccess}
              initialMode={loginModalMode}
            />

            <Routes>
              {/* Home Route - Office Stationaries */}
              <Route path="/" element={
                <Box sx={{ flex: 1, mb: 20 }}>
                  <Banner />
                  <Box mt={8}>
                    <Categories
                      selectedSubCategory={selectedSubCategory}
                      onSubCategorySelect={handleSubCategorySelect}
                    />
                  </Box>
                  <Box mt={8}>
                    <Products
                      selectedCategory="Office Stationeries"
                      selectedSubCategory={selectedSubCategory}
                      onAddToCart={handleAddToCart}
                      isLoggedIn={isLoggedIn}
                      cartCount={cartCount}
                    />
                  </Box>
                </Box>
              } />

              {/* Print and Demands Route */}
              <Route
                path="/print-demands"
                element={
                  <Box sx={{ flex: 1, mb: 20 }}>
                    <Banner />
                    <Box mt={8}>
                      <PrintDemandCategories
                        selectedSubCategory={selectedPrintDemandCategory}
                        onSubCategorySelect={handlePrintDemandCategorySelect}
                      />
                    </Box>
                    <Box mt={8}>
                      <PrintDemandProducts
                        selectedCategory={selectedPrintDemandCategory}
                        onAddToCart={handleAddToCart}
                        isLoggedIn={isLoggedIn}
                      />
                    </Box>
                  </Box>
                }
              />

              {/* IT Services Route */}
              <Route
                path="/it-services"
                element={
                  <Box sx={{ flex: 1, mb: 20 }}>
                    <Banner />
                    <Box mt={8}>
                      <ITServiceandRepairCategories
                        selectedSubCategory={selectedITServiceCategory}
                        onSubCategorySelect={handleITServiceCategorySelect}
                      />
                    </Box>
                    <Box mt={8}>
                      <ITServiceandRepiarProducts
                        selectedCategory={selectedITServiceCategory}
                        onAddToCart={handleAddToCart}
                        isLoggedIn={isLoggedIn}
                      />
                    </Box>
                  </Box>
                }
              />

              {/* Remove the standalone login route since we're using modal */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <Profile />
                  </PrivateRoute>
                }
              />

              <Route path="/book-meeting-room" 
                  element={<BookMeetingRoom isLoggedIn={isLoggedIn} />} 
              />
              <Route path="/product/:id" element={<ProductDetails onAddToCart={handleAddToCart} isLoggedIn={isLoggedIn} />} />
              <Route path="/print-demand-product/:id" element={
                  <PrintDemandProductDetails onAddToCart={handleAddToCart} isLoggedIn={isLoggedIn} />
              } />
              <Route path="/it-service/:id" element={
                  <ITServiceProductDetails onAddToCart={handleAddToCart} isLoggedIn={isLoggedIn} />
              } />
              <Route path="/cart" element={<Cart onCartUpdate={handleCartUpdate} />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/order-failed" element={<OrderFailed />} />
              <Route path="/track-order" element={<TrackOrder />} />
            </Routes>

            <Footer />
          </Box>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;