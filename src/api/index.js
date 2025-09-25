import axios from 'axios';

// Create an Axios instance configured to talk to our backend
const API = axios.create({
    // IMPORTANT: Make sure this URL matches your running backend server
    baseURL: 'http://localhost:4000/api' 
});

// --- User API Calls ---
export const login = (formData) => API.post('/users/login', formData);
export const register = (formData) => API.post('/users/register', formData);

// --- Item API Calls ---
// We need a VENDOR_ID to know which menu to fetch.
export const getVendorItems = (vendorId) => API.get(`/items/vendor/${vendorId}`);

// --- Order API Calls ---
export const createRazorpayOrder = (orderData) => API.post('/orders/create-razorpay-order', orderData);
export const placeOrder = (orderData) => API.post('/orders/place-order', orderData);
