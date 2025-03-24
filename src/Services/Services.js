import axios from '../utils/axios';

export const getProductsBySubCategory = async (category, subCategory) => {
  try {
    // This endpoint should match exactly where you're POSTing data in Services.jsx
    const response = await axios.get('/api/services', {
      params: {
        category,
        subCategory
      }
    });
    
    // If your backend returns { data: [...] }, you might need to return response.data.data
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// You might also want to add other service-related API calls here
export const getAllServices = async () => {
  try {
    const response = await axios.get('/api/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching all services:', error);
    throw error;
  }
};