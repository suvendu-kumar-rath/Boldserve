import React, { useState } from "react";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Products from "../components/Products";
import PrintDemandCategories from "../components/PrintDemandCategories";
import PrintDemandProducts from "../components/PrintDemandProducts";
import ITServiceandRepairCategories from "../components/ITServiceandRepairCategories";
import ITServiceandRepiarProducts from "../components/ITServiceandRepiarProducts";
import Login from "./Login";
import { Box } from "@mui/material";

const Home = ({ isLoggedIn }) => {
  const [selectedCategory, setSelectedCategory] = useState('Office Stationeries');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedPrintCategory, setSelectedPrintCategory] = useState(null);
  const [selectedITCategory, setSelectedITCategory] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      setCartCount(prev => prev + 1);
    }
  };

  const handleLogin = () => {
    setShowLogin(false);
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const handleCategoryChange = (categoryName, categoryId) => {
    setSelectedCategory(categoryName);
    setSelectedCategoryId(categoryId);
    if (categoryName === 'Office Stationeries') {
      setSelectedSubCategory(null);
    } else if (categoryName === 'Print and Demands') {
      setSelectedPrintCategory('Business Cards');
    } else if (categoryName === 'IT Services and Repair') {
      setSelectedITCategory('Computer & Laptop Repair');
    }
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case 'Office Stationeries':
        return (
          <>
            <Banner />
            <Box mb={8}>
              <Categories
                selectedCategory={selectedSubCategory}
                setSelectedCategory={setSelectedSubCategory}
              />
            </Box>
            <Box mt={4}>
              <Products
                selectedCategory={selectedSubCategory}
                onAddToCart={handleAddToCart}
                isLoggedIn={isLoggedIn}
              />
            </Box>
          </>
        );
      
      case 'Print and Demands':
        return (
          <>
           <Banner />
            <Box mb={8}>
              <Categories
                selectedCategory={selectedSubCategory}
                setSelectedCategory={setSelectedSubCategory}
              />
            </Box>
            <Box mt={4}>
              <Products
                selectedCategory={selectedSubCategory}
                onAddToCart={handleAddToCart}
                isLoggedIn={isLoggedIn}
              />
            </Box>
          </>
        );
      
      case 'IT Services and Repair':
        return (
          <>
            <Banner />
            <Banner />
            <Box mb={8}>
              <Categories
                selectedCategory={selectedSubCategory}
                setSelectedCategory={setSelectedSubCategory}
              />
            </Box>
            <Box mt={4}>
              <Products
                selectedCategory={selectedSubCategory}
                onAddToCart={handleAddToCart}
                isLoggedIn={isLoggedIn}
              />
            </Box>
          </>
        );
      
      default:
        return (
          <>
            <Banner />
            <Box mb={8}>
              <Categories
                selectedCategory={selectedSubCategory}
                setSelectedCategory={setSelectedSubCategory}
              />
            </Box>
            <Box mt={4}>
              <Products
                selectedCategory={selectedSubCategory}
                onAddToCart={handleAddToCart}
                isLoggedIn={isLoggedIn}
              />
            </Box>
          </>
        );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        cartCount={cartCount}
      />
      
      <Box sx={{ flex: 1, marginBottom: '20px' }}> {/* Added marginBottom for spacing */}
        {renderContent()}
      </Box>

      <Login
        open={showLogin}
        onClose={handleCloseLogin}
        onLogin={handleLogin}
      />
      
      <Footer />
    </Box>
  );
};

export default Home;