import React, { createContext, useState, useEffect, useCallback } from "react";
// FIX: Ensure the import path is correct
import * as api from '../api'; 
// FIX: This import is necessary for real-time updates
import { useSocket } from "../hooks/useSocket"; 

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_products, setAllProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    // This should be your specific Vendor ID from your database
    const VENDOR_ID = "68d576d68f832197263d351c"; 

    // RESTORED: Real-time socket hook for order updates
    const { isOrderUpdated, resetOrderUpdateFlag } = useSocket(user?._id);

    // This function fetches the order history for the current student
    const fetchOrders = useCallback(async (userId) => {
        if (!userId) return;
        try {
            const { data } = await api.getUserOrders(userId);
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error.response?.data?.message || error.message);
        }
    }, []);

    // This effect refetches orders when a real-time update is received
    useEffect(() => {
        if (isOrderUpdated && user) {
            fetchOrders(user._id);
            resetOrderUpdateFlag();
        }
    }, [isOrderUpdated, user, resetOrderUpdateFlag, fetchOrders]);

    // This function fetches the vendor's product list
    const fetchProducts = useCallback(async () => {
        try {
            const { data } = await api.getVendorItems(VENDOR_ID);
            setAllProducts(data);
            const cart = data.reduce((acc, product) => ({ ...acc, [product._id]: 0 }), {});
            setCartItems(cart);
        } catch (error) {
            console.error("Failed to fetch products:", error.response?.data?.message || error.message);
        }
    }, []);

    // Initial load: fetch products and user data
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            fetchOrders(userData._id); // FIX: Fetch orders on initial load if user exists
        }
        fetchProducts();
    }, [fetchProducts, fetchOrders]);

    const login = async (userData) => {
        try {
            const { data } = await api.login(userData);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            await fetchOrders(data._id); // FIX: Fetch orders immediately after login
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
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
            await fetchOrders(data._id); // Fetch orders (will be empty) after registration
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setOrders([]); // FIX: Clear orders and cart on logout
        setCartItems({});
    };

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }));
    };

    const getTotalCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            if (quantity > 0) {
                const itemInfo = all_products.find((product) => product._id === itemId);
                return itemInfo ? total + itemInfo.price * quantity : total;
            }
            return total;
        }, 0);
    };

    const getTotalCartItems = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + (quantity > 0 ? quantity : 0), 0);
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
                key: "YOUR_RAZORPAY_KEY_ID_HERE", // Replace with your actual Razorpay Key ID
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "Campus Food Express",
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        const orderItems = all_products
                            .filter(item => cartItems[item._id] > 0)
                            .map(item => ({
                                itemId: item._id, name: item.name, price: item.price, quantity: cartItems[item._id],
                            }));
                        const orderPayload = {
                            studentId: user._id, vendorId: VENDOR_ID, items: orderItems, totalAmount,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                        };
                        await api.placeOrder(orderPayload);
                        alert('Order placed successfully!');
                        setCartItems(Object.keys(cartItems).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));
                        await fetchOrders(user._id); // FIX: Refresh the order list immediately
                    } catch (error) {
                        console.error("Order placement failed:", error);
                        alert("Failed to place order. Please try again.");
                    }
                },
                prefill: { name: user.username },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Checkout failed:", error.response?.data?.message || error.message);
            alert("Payment process failed. Please try again.");
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

