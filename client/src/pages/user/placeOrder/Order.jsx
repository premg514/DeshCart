import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import Nav from '../../../components/UserNav';
import { useSelector } from 'react-redux';

const PlaceOrder = () => {
  const {userID } = useSelector(state => state.auth)
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Address form state
  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    
    // Get quantity from state if available (passed from product details)
    if (location.state && location.state.quantity) {
      setQuantity(location.state.quantity);
    }

    // Fetch product details
    const fetchProductDetails = async () => {

      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_BACKEND_API}/api/user/product/${id}`;
        const response = await axios.get(url);
        setProduct(response.data.product);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id, location.state]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const calculateSubtotal = () => {
    if (!product) return 0;
    const discountedPrice = product.price - (product.price * (product.discount / 100));
    return discountedPrice * quantity;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // Assuming 18% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 500 ? 0 : 50; // Free shipping over $500
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handlePlaceOrder = async () => {
    // Validate form fields
    if (!validateForm()) {
      return;
    }

    try {
      // Create order object
      const orderData = {
        userID,
        productId: id,
        quantity: quantity,
        shippingAddress: address,
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === 'upi' ? { upiId } : {},
        orderTotal: calculateTotal()
      };

      // Replace with your API endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/user/place-order`,
        orderData
      );

      if (response.status === 201) {
        alert('Order placed successfully!');
        navigate('/user/orders'); // Navigate to order history
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!address.fullName || !address.phoneNumber || !address.addressLine1 ||
      !address.city || !address.state || !address.postalCode) {
      alert('Please fill all required address fields');
      return false;
    }

    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter UPI ID');
      return false;
    }

    return true;
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  // Calculate discounted price
  const discountedPrice = product.price - (product.price * (product.discount / 100));

  return (
    <div className="order-page">
      <Nav />
      <div className="order-container">
        <h1>Checkout</h1>

        <div className="order-content">
          <div className="order-left">
            <section className="product-summary">
              <h2>Order Summary</h2>
              <div className="selected-product">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">${discountedPrice.toFixed(2)} x {quantity}</p>
                  <p className="product-subtotal">Subtotal: ${(discountedPrice * quantity).toFixed(2)}</p>
                </div>
              </div>
            </section>

            <section className="shipping-address">
              <h2>Shipping Address</h2>
              <div className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name*</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number*</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={address.phoneNumber}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine1">Address Line 1*</label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine2">Address Line 2</label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City*</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State*</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code*</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="payment-method">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <div className="payment-option">
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={handlePaymentMethodChange}
                  />
                  <label htmlFor="upi">UPI Payment</label>
                </div>
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={handlePaymentMethodChange}
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div className="upi-details">
                  <div className="form-group">
                    <label htmlFor="upiId">UPI ID*</label>
                    <input
                      type="text"
                      id="upiId"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@bankname"
                      required
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="order-right">
            <div className="order-summary-card">
              <h2>Price Details</h2>
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Tax (18%)</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Shipping</span>
                  <span>
                    {calculateShipping() === 0
                      ? 'Free'
                      : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                <div className="price-total">
                  <span>Total Amount</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                className="place-order-button"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>

              <div className="order-note">
                <p>By placing your order, you agree to our terms and conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;