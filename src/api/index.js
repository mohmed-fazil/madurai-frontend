import axios from 'axios';

// Use your production URL as the default
const API_URL = process.env.REACT_APP_API_URL || 'https://madurai-backend.onrender.com/api';
const API = axios.create({ baseURL: API_URL });

// --- User API Calls ---
export const login = (formData) => API.post('/users/login', formData);
export const register = (formData) => API.post('/users/register', formData);

// --- Item API Calls ---
export const getVendorItems = (vendorId) => API.get(`api/items/vendor/${vendorId}`);

// --- Order API Calls ---
export const createRazorpayOrder = (orderData) => API.post('/orders/create-razorpay-order', orderData);
export const placeOrder = (orderData) => API.post('/orders/place-order', orderData);
export const getUserOrders = (userId) => API.get(`api/orders/user/${userId}`);

