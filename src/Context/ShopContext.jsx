import React, { createContext, useState, useEffect } from "react";
import * as api from '../api';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_products, setAllProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [user, setUser] = useState(null);

    const VENDOR_ID = "68d576d68f832197263d351c"; 

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchProducts = async () => {
            if (!VENDOR_ID.startsWith("PASTE")) {
                try {
                    const { data } = await api.getVendorItems(VENDOR_ID);
                    setAllProducts(data);
                    let cart = {};
                    for (let i = 0; i < data.length; i++) {
                        cart[data[i]._id] = 0;
                    }
                    setCartItems(cart);
                } catch (error) {
                    console.error("Failed to fetch products:", error);
                }
            }
        };
        fetchProducts();
    }, []);

    const login = async (userData) => {
        try {
            const { data } = await api.login(userData);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            // FIX: Improved error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Login failed:", error.response.data.message);
                return { success: false, error: error.response.data.message };
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Login failed: No response from server.", error.request);
                return { success: false, error: "Could not connect to the server. Please check your connection." };
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
                return { success: false, error: "An unexpected error occurred." };
            }
        }
    };

    const register = async (userData) => {
        try {
            // Note: Our backend expects 'username' and 'password'
            const { data } = await api.register({
                username: userData.username, 
                password: userData.password, 
                role: 'student' 
            });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            // FIX: Improved error handling
            if (error.response) {
                console.error("Registration failed:", error.response.data.message);
                return { success: false, error: error.response.data.message };
            } else if (error.request) {
                console.error("Registration failed: No response from server.", error.request);
                return { success: false, error: "Could not connect to the server. Please check your connection." };
            } else {
                console.error('Error', error.message);
                return { success: false, error: "An unexpected error occurred." };
            }
        }
    };
    
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_products.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
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
                key: "rzp_test_RJu3RR7MLc3G12",
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "Campus Food Express",
                description: "Payment for your food order",
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
                    setCartItems(Object.keys(cartItems).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));
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
        register, // FIX: Ensure register is exported here
        logout,
        all_products,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        handleCheckout,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;

