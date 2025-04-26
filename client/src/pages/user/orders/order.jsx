import React, { useState, useEffect } from "react";
import Nav from "../../../components/UserNav";
import {
  FaShoppingBag,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { RiTruckLine } from "react-icons/ri";
import axios from "axios";
import "./order.css";
import { useSelector } from "react-redux";
import OrderStatusBar from "../../../components/orderStatus/OrderStatus";

const OrderStatus = {
  PENDING: "status-pending",
  PROCESSING: "status-processing",
  SHIPPED: "status-shipped",
  DELIVERED: "status-delivered",
  CANCELLED: "status-cancelled",
};

const OrderStatusIcon = {
  PENDING: <FaBox className="status-icon" />,
  PROCESSING: <RiTruckLine className="status-icon" />,
  SHIPPED: <FaTruck className="status-icon" />,
  DELIVERED: <FaCheckCircle className="status-icon" />,
  CANCELLED: <FaTimesCircle className="status-icon" />,
};

export default function Orders() {
  const { userID } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userID) {
          throw new Error("User ID not found. Please log in.");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/user/get-orders/${userID}`
        );

        if (!response.data || !response.data.orders) {
          throw new Error("Invalid response format");
        }

        setOrders(response.data.orders);

        // If there are orders, set the first one as active by default
        if (response.data.orders.length > 0) {
          setActiveOrderId(response.data.orders[0].orderId);
        }
      } catch (err) {
        console.error("Fetch Orders Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch orders. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userID]);

  const toggleOrderDetails = (orderId) => {
    if (activeOrderId === orderId) {
      setActiveOrderId(null);
    } else {
      setActiveOrderId(orderId);
    }
  };

  const getOrderStatusSteps = (status) => {
    const allStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
    let currentIndex = allStatuses.indexOf(status);

    if (status === "CANCELLED") {
      return (
        <div className="order-cancelled-banner">
          <FaTimesCircle className="cancelled-icon" />
          <span>This order was cancelled</span>
        </div>
      );
    }

    return (
      <div className="order-progress-tracker">
        {allStatuses.map((step, index) => (
          <div key={step} className="progress-step">
            <div
              className={`step-icon ${
                index <= currentIndex ? "completed" : ""
              }`}
            >
              {OrderStatusIcon[step]}
            </div>
            <div className="step-label">
              {step.charAt(0) + step.slice(1).toLowerCase()}
            </div>
            {index < allStatuses.length - 1 && (
              <div
                className={`step-connector ${
                  index < currentIndex ? "completed" : ""
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error) {
    return (
      <div className="orders-page">
        <Nav />
        <div className="error-container">
          <FaTimesCircle className="error-icon" />
          <h2 className="error-title">Oops! Something went wrong</h2>
          <p className="error-message">{error}</p>
          <button
            className="error-retry-button"
            onClick={() => {
              setError(null);
              setLoading(true);
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <Nav />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-page">
        <Nav />
        <div className="empty-orders-container">
          <FaShoppingBag className="empty-orders-icon" />
          <h2 className="empty-orders-text">No orders found</h2>
          <p className="empty-orders-subtext">
            You haven't placed any orders yet.
          </p>
          <button
            className="shop-now-button"
            onClick={() => (window.location.href = "/shop")}
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Nav />
      <div className="orders-container">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-count">{orders.length} order(s)</p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div
                className="order-header"
                onClick={() => toggleOrderDetails(order.orderId)}
              >
                <div className="order-header-info">
                  <p className="order-number">Order #{order.orderNumber}</p>
                  <div className="order-meta">
                    <span className="order-meta-item">
                      <FaCalendarAlt className="meta-icon" />
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="order-meta-item">
                      <FaMapMarkerAlt className="meta-icon" />
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}
                    </span>
                  </div>
                </div>
                <div className="order-header-right">
                  <div
                    className={`order-status ${
                      OrderStatus[order.orderStatus] || "status-default"
                    }`}
                  >
                    {OrderStatusIcon[order.orderStatus]}
                    <span>{order.orderStatus}</span>
                  </div>
                  <div className="order-total">${order.total.toFixed(2)}</div>
                </div>
              </div>

              {activeOrderId === order.orderId && (
                <div className="order-details">
                  <OrderStatusBar status={order.orderStatus} />

                  <div className="order-content">
                    <div className="order-products">
                      <h3 className="section-title">Products</h3>
                      <div className="products-grid">
                        {order.products.map((product) => (
                          <div key={product.productId} className="product-item">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="product-image"
                              />
                            ) : (
                              <div className="product-image-placeholder">
                                <FaShoppingBag className="placeholder-icon" />
                              </div>
                            )}
                            <div className="product-details">
                              <p className="product-name">{product.name}</p>
                              <div className="product-info">
                                <span className="product-quantity">
                                  Qty: {product.quantity}
                                </span>
                                <span className="product-price">
                                  ${product.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="order-info-panel">
                      <div className="order-summary">
                        <h3 className="section-title">Order Summary</h3>
                        <div className="summary-details">
                          <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="summary-row">
                            <span>Tax</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="summary-row">
                            <span>Shipping</span>
                            <span>${order.shippingCost.toFixed(2)}</span>
                          </div>
                          <div className="summary-row total">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shipping-address">
                        <h3 className="section-title">Shipping Address</h3>
                        <div className="address-card">
                          <FaMapMarkerAlt className="address-icon" />
                          <div className="address-text">
                            <p className="address-line">
                              {order.shippingAddress.street}
                            </p>
                            <p className="address-line">
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.state}{" "}
                              {order.shippingAddress.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
