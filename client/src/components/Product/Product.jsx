import React, { useState } from 'react';
import './product.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi';
import { IoMdCheckmark } from 'react-icons/io';

const Product = ({ product }) => {
  const navigate = useNavigate()
  const { _id, name, description, price, image, category, stockStatus, rating, discount } = product;
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Calculate discounted price
  const discountedPrice = price - (price * discount / 100);

  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getStockStatusClass = () => {
    if (stockStatus === 'In Stock') return 'in-stock';
    if (stockStatus === 'Low Stock') return 'low-stock';
    if (stockStatus === 'Out of Stock') return 'out-of-stock';
    return '';
  };
  
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (isAddedToCart || stockStatus === 'Out of Stock') return;
    
    setIsAddingToCart(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/user/add-cart/${_id}/${1}`
      );

      if (response.status === 201) {
        setIsAddedToCart(true);
        setTimeout(() => {
          setIsAddedToCart(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      alert(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={`product-card ${stockStatus === 'Out of Stock' ? 'out-of-stock-card' : ''}`}>
      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        </div>
        
        
        <div className="product-overlay">
          <button onClick={()=> navigate(`/user/product/${_id}`)} className="quick-view-btn">
            <FiEye /> View
          </button>
          
          <button 
            onClick={handleAddToCart} 
            className={`add-to-cart-btn ${isAddedToCart ? 'added' : ''} ${stockStatus === 'Out of Stock' ? 'disabled' : ''}`}
            disabled={isAddingToCart || stockStatus === 'Out of Stock'}
          >
            {isAddingToCart ? (
              <span className="loading-spinner"></span>
            ) : isAddedToCart ? (
              <>
                <IoMdCheckmark /> Added
              </>
            ) : (
              <>
                <FiShoppingCart /> {stockStatus === 'Out of Stock' ? 'Sold Out' : 'Add to Cart'}
              </>
            )}
          </button>

      </div>
      
      <Link to={`/user/product/${_id}`} className="product-info-link">
        <div className="product-info">
          <div className="product-header">
            <span className="product-category">{category}</span>
            <span className={`stock-status ${getStockStatusClass()}`}>{stockStatus}</span>
          </div>
          
          <h3 className="product-name">{name}</h3>
          
          <div className="product-rating">
            {renderStars()}
            <span className="rating-count">({rating})</span>
          </div>
          
          <p className="product-description">{description}</p>
          
          <div className="product-price">
            {discount > 0 && (
              <span className="original-price">${price.toFixed(2)}</span>
            )}
            <span className="current-price">${discountedPrice.toFixed(2)}</span>
            {discount > 0 && <span className="saving-label">Save ${(price - discountedPrice).toFixed(2)}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Product;