import React from "react";
import "./OrderStatusBar.css";

const OrderStatusBar = ({ status }) => {
  // Define the statuses and their respective steps
  let point = status.toUpperCase();
  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

  // Skip the progress bar for cancelled orders
  if (point === "CANCELLED") {
    return (
      <div className="order-cancelled-status">
        <svg
          className="cancelled-icon"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <span className="cancelled-text">Order Cancelled</span>
      </div>
    );
  }

  // Find the current step index
  const currentIndex = statuses.indexOf(point);

  // Calculate progress percentage
  const progressPercentage =
    currentIndex >= 0 ? (currentIndex / (statuses.length - 1)) * 100 : 0;

  return (
    <div className="status-bar-container">
      <div className="status-labels">
        {statuses.map((stepStatus, index) => (
          <div
            key={stepStatus}
            className={`status-label ${
              index <= currentIndex ? "status-active" : "status-inactive"
            }`}
          >
            {stepStatus}
          </div>
        ))}
      </div>

      <div className="progress-bar-background">
        <div
          className={`progress-bar progress-${status.toLowerCase()}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="status-dots">
        {statuses.map((stepStatus, index) => (
          <div
            key={`step-${stepStatus}`}
            className={`dot-container ${
              index === 0
                ? "align-start"
                : index === statuses.length - 1
                ? "align-end"
                : ""
            }`}
          >
            <div
              className={`status-dot ${
                index < currentIndex
                  ? `completed-${statuses[index].toLowerCase()}`
                  : index === currentIndex
                  ? `current-${point.toLowerCase()}`
                  : "dot-inactive"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusBar;
