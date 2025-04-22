import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import './cartProduct.css';
import { Link } from 'react-router-dom';

export default function CartProduct({_id, product, quantity, onQuantityChange, onRemove }) {
    const [productDetails, setProductDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [changedQuantity, setChangedQuantity] = useState(quantity);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API}/api/user/product/${product}`
                );
                setProductDetails(response.data.product);
            } catch (err) {
                console.error("Error fetching product details:", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (product) {
            fetchProductDetails();
        }
    }, [product]);

    const handleDec = () => {
        if (changedQuantity > 1) {
            const newQuantity = changedQuantity - 1;
            setChangedQuantity(newQuantity);
            onQuantityChange(_id, newQuantity);
        }
    };

    const handleInc = () => {
        const newQuantity = changedQuantity + 1;
        setChangedQuantity(newQuantity);
        onQuantityChange(_id, newQuantity);
    };

    if (isLoading) return <tr><td colSpan="5">Loading...</td></tr>;
    if (!productDetails) return null;

    return (
        <tr className="cart-product-row">
            <td>
                <Link to={`/user/product/${product}`} className="product-info">
                    <div className="product-image">
                        {productDetails.image && (
                            <img src={productDetails.image} alt={productDetails.name} />
                        )}
                    </div>
                    <div className="product-name">{productDetails.name}</div>
                </Link>
            </td>
            <td className="product-price">${productDetails.price}</td>
            <td>
                <div className="quantity-controls">
                    <button
                        onClick={handleDec}
                        disabled={changedQuantity <= 1}
                    >
                        -
                    </button>
                    <span>{changedQuantity}</span>
                    <button onClick={handleInc}>+</button>
                </div>
            </td>
            <td className="item-total">${(productDetails.price * changedQuantity).toFixed(2)}</td>
            <td>
                <button 
                    title='delete' 
                    className="remove-button" 
                    onClick={onRemove}
                >
                    <MdDelete fontSize={25} />
                </button>
            </td>
        </tr>
    );
}