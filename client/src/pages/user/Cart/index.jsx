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

    const calculateSubtotal = () => {
        return cartProducts.reduce((total, item) => {
            const price = item?.productID?.price ?? 0;
            const quantity = item?.productQuantity ?? 0;
            return total + (price * quantity);
        }, 0).toFixed(2);
    };

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

    if (isLoading) return <div className="cart-loading">Loading your cart...</div>;
    if (error) return <div className="cart-error">{error}</div>;
    if (cartProducts.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate('/')}>Continue Shopping</button>
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
                <tfoot>
                    <tr>
                        <td colSpan="3" className="subtotal-label">Subtotal:</td>
                        <td className="subtotal-value">${calculateSubtotal()}</td>
                        <td></td>
                    </tr>
                </tfoot>
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