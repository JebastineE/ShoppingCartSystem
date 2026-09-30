import React, { useState, useMemo } from 'react';
import OrderCard from './OrderCard';
import { formatCurrency } from '../utils/formatters';

/**
 * OrderList Component
 * Displays previous orders fetched from GET /api/orders,
 * with summary statistics, order search, refresh, and details view.
 */
function OrderList({
  orders = [],
  loading = false,
  error = null,
  onRefresh,
  onViewDetails,
  onNavigateToProducts,
  viewingOrderId = null,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate order statistics
  const totalSpent = useMemo(() => {
    return orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
  }, [orders]);

  const avgOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;

  // Filter orders by ID or date
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          String(o.orderId).includes(term) ||
          (o.orderDate && o.orderDate.toLowerCase().includes(term))
        );
      })
      // Sort newest first
      .sort((a, b) => b.orderId - a.orderId);
  }, [orders, searchTerm]);

  return (
    <section className="orders-section" aria-labelledby="orders-heading">
      {/* Section Header */}
      <div className="section-header-row">
        <div>
          <div className="section-tag">HISTORY</div>
          <h2 id="orders-heading" className="section-title">
            Previous Orders
          </h2>
          <p className="section-subtitle">
            Track and inspect all orders generated via the backend checkout service.
          </p>
        </div>

        <div className="section-header-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh orders from Spring Boot API (GET /api/orders)"
          >
            <span className={loading ? 'spinning' : ''}>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Orders Summary Metrics */}
      {orders.length > 0 && (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📦</div>
            <div className="metric-content">
              <span className="metric-label">Total Orders Placed</span>
              <span className="metric-value">{orders.length}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <span className="metric-label">Cumulative Total Spent</span>
              <span className="metric-value text-primary">{formatCurrency(totalSpent)}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <span className="metric-label">Average Order Value</span>
              <span className="metric-value">{formatCurrency(avgOrderValue)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter / Search Bar if multiple orders */}
      {orders.length > 0 && (
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by Order ID (e.g. 5001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="order-search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div className="error-details">
            <h3 className="error-title">Failed to load orders</h3>
            <p className="error-message">{error}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onRefresh}>
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && orders.length === 0 && (
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">Loading orders from backend (GET /api/orders)...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📜</div>
          <h3 className="empty-title">
            {searchTerm ? 'No orders match your search' : 'No previous orders found'}
          </h3>
          <p className="empty-subtitle">
            {searchTerm
              ? 'Try searching with a different order number.'
              : 'Add products to your cart and checkout to create your first order!'}
          </p>
          {!searchTerm && onNavigateToProducts && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNavigateToProducts}
            >
              <span>🛒</span>
              <span>Shop Now</span>
            </button>
          )}
        </div>
      )}

      {/* Orders Grid */}
      {!loading && filteredOrders.length > 0 && (
        <div className="orders-grid" id="orders-grid">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onViewDetails={onViewDetails}
              isViewing={viewingOrderId === order.orderId}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default OrderList;
