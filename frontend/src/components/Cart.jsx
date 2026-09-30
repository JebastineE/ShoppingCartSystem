import React from 'react';
import CartItem from './CartItem';
import { formatCurrency } from '../utils/formatters';

/**
 * Cart Component
 * Displays:
 * - Shopping cart section with list of items (Product ID, Quantity, Delete button)
 * - Order summary (Subtotal, Total items, Grand Total)
 * - Checkout button (POST /api/orders/checkout)
 */
function Cart({
  cartItems = [],
  products = [],
  loading = false,
  error = null,
  onRefresh,
  onUpdateQuantity,
  onDeleteCartItem,
  onCheckout,
  onNavigateToProducts,
  isCheckingOut = false,
  deletingCartItemId = null,
  updatingCartItemId = null,
}) {
  // Create a quick lookup map of products by productId for item names and prices
  const productMap = React.useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.productId] = p;
    });
    return map;
  }, [products]);

  // Calculate cart statistics
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalAmount = cartItems.reduce((acc, item) => {
    const product = productMap[item.productId];
    const price = product?.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0);

  const isCartEmpty = cartItems.length === 0;

  return (
    <section className="cart-section" aria-labelledby="cart-heading">
      {/* Section Header */}
      <div className="section-header-row">
        <div>
          <div className="section-tag">YOUR SELECTIONS</div>
          <h2 id="cart-heading" className="section-title">
            Shopping Cart
          </h2>
          <p className="section-subtitle">
            Review your selected products and proceed to checkout.
          </p>
        </div>

        <div className="section-header-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh cart from Spring Boot API (GET /api/cart)"
          >
            <span className={loading ? 'spinning' : ''}>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div className="error-details">
            <h3 className="error-title">Failed to load cart</h3>
            <p className="error-message">{error}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onRefresh}>
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && cartItems.length === 0 && (
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">Loading cart items (GET /api/cart)...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && isCartEmpty && (
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <h3 className="empty-title">Your shopping cart is empty</h3>
          <p className="empty-subtitle">
            You haven't added any products to your cart yet. Explore our store and pick your favorites!
          </p>
          {onNavigateToProducts && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNavigateToProducts}
              id="browse-products-btn"
            >
              <span>📦</span>
              <span>Browse Products</span>
            </button>
          )}
        </div>
      )}

      {/* Cart Content: Item List + Summary */}
      {!isCartEmpty && (
        <div className="cart-layout">
          {/* Items List (Left/Main column) */}
          <div className="cart-items-container">
            <div className="cart-table-header">
              <span>Item & Product ID</span>
              <span>Quantity & Subtotal</span>
              <span>Action</span>
            </div>

            <div className="cart-items-list" id="cart-items-list">
              {cartItems.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  productInfo={productMap[item.productId]}
                  onUpdateQuantity={onUpdateQuantity}
                  onDelete={onDeleteCartItem}
                  isDeleting={deletingCartItemId === item.cartItemId}
                  isUpdating={updatingCartItemId === item.cartItemId}
                />
              ))}
            </div>
          </div>

          {/* Cart Summary & Checkout Card (Right column) */}
          <div className="cart-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-label">Items Count:</span>
                <span className="summary-value">{totalItemsCount} units</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">{formatCurrency(totalAmount)}</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Standard Shipping:</span>
                <span className="summary-value text-success">FREE</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row summary-total-row">
                <span className="summary-label">Total Amount:</span>
                <span className="summary-total-value">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Requirement 4: Checkout Button */}
            <button
              type="button"
              className="btn btn-primary btn-checkout"
              onClick={onCheckout}
              disabled={isCheckingOut || isCartEmpty}
              id="checkout-btn"
            >
              {isCheckingOut ? (
                <>
                  <span className="spinner-sm" />
                  <span>Processing Checkout...</span>
                </>
              ) : (
                <>
                  <span>💳</span>
                  <span>Proceed to Checkout ({formatCurrency(totalAmount)})</span>
                </>
              )}
            </button>

            <div className="checkout-guarantee">
              <span className="guarantee-icon">🔒</span>
              <span>Transfers cart items to Orders & updates stock in backend.</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;
