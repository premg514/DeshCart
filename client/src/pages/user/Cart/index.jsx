import React, { useEffect, useState } from 'react';
import './index.css';
import axios from 'axios';
import CartProduct from '../../../components/CartProducts/CartProducts';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const [cartProducts, setCartProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchCartData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/user/cart`);
            setCartProducts(response.data.products || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError("Failed to load your cart. Please try again.");
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

   

    const handleQuantityChange = async (id, newQuantity) => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/user/cart/update`, {
                id,
                quantity: newQuantity
            });
            fetchCartData();
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/user/cart/remove/${productId}`);
            fetchCartData();
        } catch (err) {
            console.error("Error removing item:", err);
        }
    };

    if (isLoading) return (
        <div className="cart-loading">
            Loading your cart...
        </div>
    );
    
    if (error) return (
        <div className="cart-error">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={fetchCartData} className="retry-button">
                Try Again
            </button>
        </div>
    );
    
    if (cartProducts.length === 0) {
        return (
            <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet. Explore our products and find something you love!</p>
                <button onClick={() => navigate('/')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>

            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cartProducts.map((item) => (
                        <CartProduct
                            key={item._id}
                            _id={item._id}
                            product={item.productID}
                            quantity={item.productQuantity}
                            onQuantityChange={(id, newQty) => handleQuantityChange(id, newQty)}
                            onRemove={() => handleRemoveItem(item._id)}
                        />
                    ))}
                </tbody>
                
            </table>

            <div className="cart-actions">
                <button
                    className="continue-shopping"
                    onClick={() => navigate('/')}
                >
                    Continue Shopping
                </button>
              
            </div>
        </div>
    );
}