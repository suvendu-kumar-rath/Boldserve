import axios from 'axios';

// Use environment variable with fallback
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8003';
const API_URL = `${BASE_URL}/api`;

const instance = axios.create({
    baseURL: BASE_URL,  // Use BASE_URL instead of hardcoded value
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        console.log('Request being sent:', config);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        console.log('Response received:', response);
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        return Promise.reject(error);
    }
);

// Add auth token to requests
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create a separate instance for authenticated requests
const authInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to all requests
authInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API endpoints for categories and subcategories
export const categoryApi = {
    getCategories: () => axios.get(`${API_URL}/categories`),
    getCategorySubcategories: (categoryId) => axios.get(`${API_URL}/categories/${categoryId}/subcategories`),
    getPrintAndDemandsSubCategories: () => 
        instance.get('/api/services/subcategories/print-and-demands'),
    getPrintAndDemands: (subCategory) => 
        instance.get('/api/services/category', {
            params: {
                category: 'Print and Demands',
                subCategory: subCategory
            }
        }),
    getITServices: () => axios.get('/api/categories/it-services'),
    getOfficeStationeries: () => axios.get('/api/categories/office-stationeries'),
    getPrintAndDemands: () => axios.get('/api/categories/print-and-demands'),
    getITServices: () => axios.get('/api/categories/it-services')
};

export const userAPI = {
    register: async (userData) => {
        try {
            const response = await instance.post('/api/users/register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await instance.post('/api/users/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
};

export const productApi = {
    getAllProducts: () => instance.get('/products'),
    getProductsByCategory: (categoryId) => instance.get(`/products/category/${categoryId}`),
    getProductsBySubCategory: (category, subCategory) => {
        return axios.get(`${API_URL}/categories/${category}/products`, {
            params: { subCategory }
        });
    },
    getProductById: (id) => instance.get(`/products/${id}`),
    getAllStationeryProducts: () => instance.get('/products/stationery'),
    getStationeryBySubCategory: (subCategoryId) => 
        instance.get(`/products/stationery/subcategory/${subCategoryId}`),
    getProductWithRatings: (id) => 
        instance.get(`/products/${id}`, {
            params: {
                includeRatings: true
            }
        }),
    getRatingsAndReviews: (productId) => 
        instance.get(`/api/services/product/ratings/${productId}`)
};

export const officeStationariesApi = {
    // Get all office stationaries products
    getAllProducts: () => 
        instance.get('/api/services/category', {
            params: { 
                category: 'Office Stationaries' 
            },
            // Add baseURL to ensure proper URL resolution for images
            baseURL: BASE_URL
        }),

    // Get products by subcategory
    getProductsBySubCategory: (subCategory) => 
        instance.get('/api/services/category', {
            params: {
                category: 'Office Stationaries',
                subCategory
            },
            // Add baseURL to ensure proper URL resolution for images
            baseURL: BASE_URL
        }),

    // Get all categories and subcategories structure
    getCategoriesStructure: () => 
        instance.get('/api/services/categories'),

    // Get all subcategories for Office Stationaries
    getSubCategories: () => 
        instance.get('/api/services/subcategories/Office Stationaries'),

    // Get products with ratings
    getProductsWithRatings: (subCategory) => 
        instance.get('/api/services/category', {
            params: {
                category: 'Office Stationaries',
                subCategory,
                includeRatings: true
            },
            baseURL: BASE_URL
        })
};

export const itServicesApi = {
    // Get all IT Services products
    getAllProducts: () => 
        instance.get('/api/services/category', {
            params: { category: 'IT Services and Repair' }
        }),

    // Get products by subcategory
    getProductsBySubCategory: (subCategory) => 
        instance.get('/api/services/category', {
            params: {
                category: 'IT Services and Repair',
                subCategory
            }
        }),

    // Get all subcategories for IT Services
    getSubCategories: () => 
        instance.get('/api/services/subcategories/IT Services and Repair'),

    // Get products with ratings
    getProductsWithRatings: (subCategory) => 
        instance.get('/api/services/category', {
            params: {
                category: 'IT Services and Repair',
                subCategory,
                includeRatings: true
            },
            baseURL: BASE_URL
        })
};

export const printDemandsApi = {
    // Get all Print and Demands products
    getAllProducts: () => 
        instance.get('/api/services/category', {
            params: { 
                category: 'Print and Demands' 
            },
            baseURL: BASE_URL  // Add this to ensure proper image URL resolution
        }),

    // Get products by subcategory
    getProductsBySubCategory: (subCategory) => 
        instance.get('/api/services/category', {
            params: {
                category: 'Print and Demands',
                subCategory
            },
            baseURL: BASE_URL  // Add this to ensure proper image URL resolution
        }),

    // Get all subcategories for Print and Demands
    getSubCategories: () => 
        instance.get('/api/services/subcategories/Print and Demands'),  // Fix the category name format

    // Get products with ratings
    getProductsWithRatings: (subCategory) => 
        instance.get('/api/services/category', {
            params: {
                category: 'Print and Demands',
                subCategory,
                includeRatings: true
            },
            baseURL: BASE_URL
        })
};

// Add new ratings and reviews API
export const ratingsAndReviewsApi = {
    // Get product ratings and review count
    getProductRatings: (productId) => 
        instance.get(`/api/services/product/ratings/${productId}`),

    // Submit a new review
    submitReview: (reviewData) => 
        instance.post('/api/services/product/review', reviewData),

    // Get full reviews for a product
    getProductReviews: (productId) => 
        instance.get(`/api/services/product/reviews/${productId}`),
};

// Update cart API with simplified routes
export const cartApi = {
    getCartItems: async () => {
        try {
            const response = await instance.get('/api/cart', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Cart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    },

    addToCart: async (productId, quantity = 1) => {
        try {
            const response = await instance.post('/api/cart/add', 
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log('Add to cart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }
};

export default instance;