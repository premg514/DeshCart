import React, { useEffect, useState } from 'react';
import './sales.css';
import Nav from '../../../components/Nav';
import axios from 'axios';
import { useSelector } from 'react-redux';
export default function Sales() {
    const {userID } = useSelector(state => state.auth)
    const [orders, setOrders] = useState([]);
    const [productDetails, setProductDetails] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Order status options
    const orderStatusOptions = [
        'pending', 
        'processing', 
        'shipped', 
        'delivered', 
        'cancelled'
    ];

    const fetchProductDetails = async (productId) => {
        if (productDetails[productId]) {
            return productDetails[productId];
        }

        try {
            const url = `${import.meta.env.VITE_BACKEND_API}/api/user/product/${productId}`;
            const response = await axios.get(url);
            const productData = response.data.product;

            setProductDetails((prev) => ({
                ...prev,
                [productId]: productData
            }));

            return productData;
        } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API}/api/admin/orders/${orderId}/status`, 
                { orderStatus: newStatus }
            );

            // Update local state to reflect the change
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.orderId === orderId 
                        ? { ...order, orderStatus: newStatus } 
                        : order
                )
            );

            // Optional: Show success message
            alert(`Order ${orderId} status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/orders/${userID}`);
                
                if (isMounted) {
                    setOrders(response.data.data);
                    setError(null);

                    const productIds = [...new Set(response.data.data.flatMap(order =>
                        order.products.map(product => product.product)
                    ))];

                    await Promise.all(productIds.map(fetchProductDetails));
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                if (isMounted) setError("Failed to fetch orders. Please try again later.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (userID) {
            fetchData();
        }

        return () => {
            isMounted = false;
        };
    }, [userID]);

    const calculateTotalOrderValue = (products) => {
        return products.reduce((total, product) => total + ((product.price || 0) * (product.quantity || 0)), 0).toFixed(2);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'text-yellow-600';
            case 'processing': return 'text-blue-600';
            case 'shipped': return 'text-green-600';
            case 'delivered': return 'text-green-800';
            case 'cancelled': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    if (loading) {
        return <div className="loading">Loading your sales data...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="salesPage">
            <Nav />
            <div className="sales-header">
                <h1>Sales Overview</h1>
            </div>
            
            {orders.length === 0 ? (
                <div className="error">No orders found.</div>
            ) : (
                <table className="sales-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Products</th>
                            <th>Total Value</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId}>
                                <td>{order.orderNumber || order.orderId}</td>
                                <td>
                                    {order.user ? (
                                        <>
                                            <strong>{order.user.name}</strong><br />
                                            {order.user.email}
                                        </>
                                    ) : (
                                        "User data unavailable"
                                    )}
                                </td>
                                <td>
                                    <div className="product-list">
                                        {order.products.map((product) => {
                                            const productDetail = productDetails[product.product];
                                            return (
                                                <div key={product._id} className="product-item">
                                                    {productDetail ? (
                                                        <>
                                                            <div className="product-image">
                                                                <img 
                                                                    src={(productDetail.image && productDetail.image.length > 0) ? productDetail.image : '/placeholder-image.png'} 
                                                                    alt={productDetail.name || "Product"} 
                                                                />
                                                            </div>
                                                            <div className="product-info">
                                                                <h3>{productDetail.name}</h3>
                                                                <p>{productDetail.description}</p>
                                                                <div className="product-details">
                                                                    <span>ID: {product.product}</span>
                                                                    <span>Qty: {product.quantity}</span>
                                                                    <span>Price: ${product.price || 0}</span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div>Loading product details...</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td><strong>${calculateTotalOrderValue(order.products)}</strong></td>
                                <td>
                                    <span className={`font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        value={order.orderStatus} 
                                        onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                        className="status-select"
                                    >
                                        {orderStatusOptions.map(status => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}