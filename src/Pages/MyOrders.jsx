import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './CSS/MyOrders.css';

const MyOrders = () => {
    const { orders, fetchOrders, user } = useContext(ShopContext);

    // Fetch orders when the component mounts or when the user changes.
    useEffect(() => {
        if (user) {
            fetchOrders(user._id);
        }
    }, [user, fetchOrders]);

    // Safety check to ensure 'orders' is not undefined before rendering.
    if (!orders) {
        return <p>Loading your orders...</p>;
    }

    if (!user) {
        return <p>Please log in to see your orders.</p>;
    }
    
    if (orders.length === 0) {
        return <div className="myorders-no-orders"><p>You haven't placed any orders yet.</p></div>;
    }

    return (
        <div className="myorders">
            <h1>My Orders</h1>
            <div className="myorders-container">
                {orders.map((order) => (
                    <div key={order._id} className="myorders-order-card">
                        <div className="myorders-header">
                            <div>
                                <h3>Order ID: {order.orderId}</h3>
                                <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className={`myorders-status ${order.orderStatus.toLowerCase()}`}>
                                {order.orderStatus}
                            </div>
                        </div>
                        <div className="myorders-items">
                            {order.items.map((item) => (
                                <div key={item._id} className="myorders-item">
                                    <span>{item.name} (x{item.quantity})</span>
                                    <span>{item.isDelivered ? 'Delivered' : 'Pending'}</span>
                                </div>
                            ))}
                        </div>
                        <div className="myorders-footer">
                            <strong>Total: ₹{order.totalAmount.toFixed(2)}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;

