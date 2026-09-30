import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * OrderDetailsModal Component
 * Shows detailed inspection of a specific order fetched via GET /api/orders/{id}
 */
function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const { orderId, totalAmount, orderDate } = order;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">📜</span>
            <h3 className="modal-title">Order Details #{orderId}</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="order-details-body">
          <div className="order-details-meta-grid">
            <div className="meta-box">
              <span className="meta-box-label">Order Identifier</span>
              <span className="meta-box-value">#{orderId}</span>
            </div>

            <div className="meta-box">
              <span className="meta-box-label">Date Processed</span>
              <span className="meta-box-value">{formatDate(orderDate)}</span>
            </div>

            <div className="meta-box">
              <span className="meta-box-label">Payment Status</span>
              <span className="badge badge-success">Completed & Settled</span>
            </div>

            <div className="meta-box">
              <span className="meta-box-label">Total Amount</span>
              <span className="meta-box-value text-primary font-bold">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <div className="order-info-note">
            <p>
              ℹ️ Order was processed via the database stored procedure <code>CALL checkout()</code>.
              Products purchased have their stock updated automatically in PostgreSQL.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
