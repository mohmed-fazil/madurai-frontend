import React, { createContext, useState, useEffect, useCallback } from "react";
// FIX: Corrected the import path to point to the new api/index.js file
import * as api from '../api'; 
// FIX: Corrected the import path to point to the new hooks/useSocket.js file
import { useSocket } from "../hooks/useSocket";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_products, setAllProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    // This should be your specific Vendor ID from your database
    const VENDOR_ID = "68d576d68f832197263d351c"; 

    // Use the socket hook to listen for real-time updates for the logged-in user
    const { isOrderUpdated, resetOrderUpdateFlag } = useSocket(user?._id);

    // This function fetches the order history for the current student
    // FIX: Wrapped in useCallback to satisfy dependency warnings
    const fetchOrders = useCallback(async (userId) => {
        const idToFetch = userId || user?._id;
        if (!idToFetch) return;
        try {
            const { data } = await api.getUserOrders(idToFetch);
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    }, [user]); // This function depends on the 'user' state

    // This effect refetches orders when a real-time update is received
    useEffect(() => {
        if (isOrderUpdated && user) {
            fetchOrders(user._id);
            resetOrderUpdateFlag();
        }
    }, [isOrderUpdated, user, resetOrderUpdateFlag, fetchOrders]); // FIX: Added fetchOrders to dependency array

    // This function fetches the vendor's product list
    const fetchProducts = useCallback(async () => {
        if (!VENDOR_ID.startsWith("PASTE")) {
            try {
                const { data } = await api.getVendorItems(VENDOR_ID);
                setAllProducts(data);
                // Initialize an empty cart based on the fetched products
                let cart = {};
                for (let i = 0; i < data.length; i++) {
                    cart[data[i]._id] = 0;
                }
                setCartItems(cart);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        }
    }, []); // This function has no dependencies

    // This effect runs on initial load to fetch products and check for a logged-in user
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            fetchOrders(userData._id);
        }
        fetchProducts();
    }, [fetchProducts, fetchOrders]); // FIX: Added dependencies to array

    const login = async (userData) => {
        try {
            const { data } = await api.login(userData);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            fetchOrders(data._id); // Fetch orders after login
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed.";
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await api.register({
                username: userData.username, 
                password: userData.password, 
                role: 'student' 
            });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed.";
            return { success: false, error: errorMessage };
        }
    };
    
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setOrders([]); // Clear orders on logout
    };

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }));
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                let itemInfo = all_products.find((product) => product._id === itemId);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[itemId];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                totalItem += cartItems[itemId];
            }
        }
        return totalItem;
    };

    const handleCheckout = async () => {
        if (!user) {
            alert("Please log in to place an order.");
            return;
        }
        const totalAmount = getTotalCartAmount();
        if (totalAmount === 0) {
            alert("Your cart is empty.");
            return;
        }
        try {
            const { data: razorpayOrder } = await api.createRazorpayOrder({ amount: totalAmount });
            const options = {
                key: "YOUR_RAZORPAY_KEY_ID_HERE", // IMPORTANT: Replace with your actual key
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "Campus Food Express",
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    const orderItems = all_products
                        .filter(item => cartItems[item._id] > 0)
                        .map(item => ({
                            itemId: item._id, name: item.name, price: item.price, quantity: cartItems[item._id],
                        }));
                    const orderPayload = {
                        studentId: user._id, vendorId: VENDOR_ID, items: orderItems, totalAmount: totalAmount,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                    };
                    await api.placeOrder(orderPayload);
                    alert('Order placed successfully!');
                    // Reset the cart
                    setCartItems(Object.keys(cartItems).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));
                    fetchOrders(user._id); // Refresh the order list
                },
                prefill: { name: user.username },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Checkout failed:", err);
            alert('Payment process failed. Please try again.');
        }
    };

    const contextValue = {
        user,
        login,
        register,
        logout,
        all_products,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        handleCheckout,
        orders,
        fetchOrders,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;

