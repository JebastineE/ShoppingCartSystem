import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * OrderCard Component
 * Displays a single previous order:
 * - Order ID
 * - Order Date
 * - Total Amount
 * - Status badge
 * - View details trigger
 */
function OrderCard({ order, onViewDetails, isViewing = false }) {
  const { orderId, totalAmount, orderDate } = order;

  return (
    <div className="order-card" id={`order-${orderId}`}>
      <div className="order-card-header">
        <div className="order-id-group">
          <span className="order-icon">🧾</span>
          <div>
            <h3 className="order-id-title">Order #{orderId}</h3>
            <span className="order-date-text">{formatDate(orderDate)}</span>
          </div>
        </div>

        <span className="badge badge-success">Completed</span>
      </div>

      <div className="order-card-body">
        <div className="order-amount-block">
          <span className="order-amount-label">Total Amount Paid</span>
          <span className="order-amount-value">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <div className="order-card-footer">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onViewDetails(orderId)}
          disabled={isViewing}
          id={`view-order-btn-${orderId}`}
        >
          {isViewing ? (
            <>
              <span className="spinner-sm" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>View Details</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
