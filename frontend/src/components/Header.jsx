import React from 'react';
import { API_BASE_URL, DEFAULT_BACKEND_URL } from '../config';

/**
 * Header Component
 * Displays the main app bar with "Shopping Cart System", navigation tabs,
 * cart item count badge, and backend connection info.
 */
function Header({
  activeTab,
  setActiveTab,
  cartCount = 0,
  productCount = 0,
  orderCount = 0,
  backendConnected = true,
  onOpenAddProduct,
}) {
  return (
    <header className="header">
      <div className="header-container">
        {/* Brand / Title */}
        <div className="header-brand" onClick={() => setActiveTab('products')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">🛒</div>
          <div>
            <h1 className="brand-title">Shopping Cart System</h1>
            <div className="brand-subtitle">Spring Boot + React Storefront</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="header-nav" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
            id="nav-products-btn"
          >
            <span className="nav-icon">📦</span>
            <span>Products</span>
            {productCount > 0 && <span className="nav-badge">{productCount}</span>}
          </button>

          <button
            type="button"
            className={`nav-btn ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveTab('cart')}
            id="nav-cart-btn"
          >
            <span className="nav-icon">🛍️</span>
            <span>Cart</span>
            {cartCount > 0 && <span className="nav-badge nav-badge-accent">{cartCount}</span>}
          </button>

          <button
            type="button"
            className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            id="nav-orders-btn"
          >
            <span className="nav-icon">📜</span>
            <span>Orders</span>
            {orderCount > 0 && <span className="nav-badge">{orderCount}</span>}
          </button>

          {/* Quick Add Product Button */}
          {onOpenAddProduct && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenAddProduct}
              id="header-add-product-btn"
              title="Add a new product to store"
            >
              <span style={{ fontSize: '1rem' }}>+</span> Add Product
            </button>
          )}
        </nav>

        {/* Backend Status indicator */}
        <div className="backend-status-pill" title={`Backend Base URL: ${API_BASE_URL || DEFAULT_BACKEND_URL}`}>
          <span
            className={`status-dot ${backendConnected ? 'status-dot-online' : 'status-dot-offline'}`}
          />
          <span className="status-text">
            {backendConnected ? 'Backend Online' : 'Backend Offline'}
          </span>
          <span className="backend-url-tag">{(API_BASE_URL || DEFAULT_BACKEND_URL).replace(/^https?:\/\//, '')}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
