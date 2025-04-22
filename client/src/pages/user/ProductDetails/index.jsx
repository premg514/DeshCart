import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './index.css';
import axios from 'axios';
import Nav from '../../../components/UserNav';
const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch product details from backend API using the ID
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const url = `${import.meta.env.VITE_BACKEND_API}/api/user/product/${id}`;
                const response = await axios.get(url);

                // No need to check response.ok with axios
                const productData = response.data.product;
                setProduct(productData);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching product details:', err);
                // More robust error handling for axios errors
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    if (loading) {
        return <div className="loading">Loading product details...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!product) {
        return <div className="not-found">Product not found</div>;
    }

    const handleQuantityChange = (e) => {
        setQuantity(Math.max(1, parseInt(e.target.value) || 1));
    };

    const handleAddToCart = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/api/user/add-cart/${id}/${quantity}`
            );

            if (response.status === 201) {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error adding product to cart:", error.message);
            alert(error.response.data.message);
        }
    };


    const handleBuyNow = () => {
        navigate(`/user/order/${id}`, {
          state: {
            quantity: quantity
          }
        });
      };
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Calculate discounted price
    const discountedPrice = product.price - (product.price * (product.discount / 100));

    return (
        <div className='whole' >
            <Nav />
            <div className="product-details-container">

                <div className="breadcrumb">
                    <span onClick={() => navigate('/')}>Home</span> /
                    {product.name}
                </div>

                <div className="product-details-main">
                    <div className="product-details-left">
                        <div className="product-main-image">
                            <img src={product.image} alt={product.name} />
                            {product.discount > 0 && <span className="discount-badge-large">-{product.discount}%</span>}
                        </div>
                        <div className="product-thumbnails">
                            {/* This would map through additional product images in a real app */}
                            <img src={product.image} alt={product.name} className="thumbnail active" />
                            {/* Placeholder thumbnails for demonstration */}
                            <div className="thumbnail placeholder"></div>
                            <div className="thumbnail placeholder"></div>
                        </div>
                    </div>

                    <div className="product-details-right">
                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-meta">
                            <div className="product-rating-large">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className={`star ${star <= product.rating ? 'filled' : 'empty'}`}>
                                        ★
                                    </span>
                                ))}
                                <span className="rating-count">(Reviews)</span>
                            </div>
                            <div className="product-stock">{product.stockStatus}</div>
                        </div>

                        <div className="product-price-large">
                            {product.discount > 0 && (
                                <span className="original-price">${product.price.toFixed(2)}</span>
                            )}
                            <span className="current-price">${discountedPrice.toFixed(2)}</span>
                        </div>

                        <p className="product-description-short">{product.description}</p>

                        <div className="product-purchase">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.quantity}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                                <button onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}>+</button>
                            </div>

                            <div className="product-buttons">
                                <button className="add-to-cart-button" onClick={handleAddToCart}>
                                    Add to Cart
                                </button>
                                <button className="buy-now-button" onClick={handleBuyNow}>
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        <div className="product-additional-info">

                            <div className="info-item">
                                <span className="info-label">Available Quantity:</span>
                                <span className="info-value">{product.quantity}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Category:</span>
                                <span className="info-value">{product.category}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Added On:</span>
                                <span className="info-value">{new Date(product.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="product-tabs">
                    <div className="tabs-header">
                        <button
                            className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => handleTabChange('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'specifications' ? 'active' : ''}`}
                            onClick={() => handleTabChange('specifications')}
                        >
                            Specifications
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => handleTabChange('reviews')}
                        >
                            Reviews
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="description-tab">
                                <p>{product.description}</p>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="specifications-tab">
                                <table className="specs-table">
                                    <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td>{product.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Category</td>
                                            <td>{product.category}</td>
                                        </tr>
                                        <tr>
                                            <td>Stock Status</td>
                                            <td>{product.stockStatus}</td>
                                        </tr>
                                        <tr>
                                            <td>Available Quantity</td>
                                            <td>{product.quantity}</td>
                                        </tr>
                                        <tr>
                                            <td>Rating</td>
                                            <td>{product.rating} out of 5</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="reviews-tab">
                                <div className="review-summary">
                                    <div className="average-rating">
                                        <div className="rating-number">{product.rating}</div>
                                        <div className="rating-stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className={`star ${star <= product.rating ? 'filled' : 'empty'}`}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <div className="total-reviews">Based on reviews</div>
                                    </div>
                                </div>
                                <div className="review-list">
                                    {/* This would be populated with actual reviews from API */}
                                    <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <Product key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )} */}
            </div>
        </div>

    );
};

export default ProductDetails;