import React from 'react';
import { formatCurrency, getProductIcon } from '../utils/formatters';

/**
 * CartItem Component
 * Displays individual cart item:
 * - Product ID (prominently featured per requirement 3)
 * - Product Name & unit price (matched from catalog)
 * - Quantity selector (- / + buttons)
 * - Delete button (calls DELETE /api/cart/{cartItemId})
 */
function CartItem({
  item,
  productInfo,
  onUpdateQuantity,
  onDelete,
  isDeleting = false,
  isUpdating = false,
}) {
  const { cartItemId, productId, quantity } = item;
  const name = productInfo?.name || `Product #${productId}`;
  const price = productInfo?.price || 0;
  const stock = productInfo?.stock ?? 999;
  const itemTotal = price * quantity;

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(cartItemId, productId, quantity - 1);
    } else {
      // If quantity is 1 and user clicks minus, confirm removal or call delete
      onDelete(cartItemId, name);
    }
  };

  const handleIncrease = () => {
    if (quantity < stock) {
      onUpdateQuantity(cartItemId, productId, quantity + 1);
    }
  };

  return (
    <div className="cart-item-row" id={`cart-item-${cartItemId}`}>
      {/* Product Icon & Identity */}
      <div className="cart-item-info">
        <div className="cart-item-icon">{getProductIcon(name)}</div>

        <div className="cart-item-details">
          {/* Requirement 3: Product ID explicitly shown */}
          <div className="cart-product-id-badge" title="Backend Product ID">
            Product ID: <strong>#{productId}</strong>
          </div>

          <h4 className="cart-item-name">{name}</h4>

          <div className="cart-item-unit-price">
            Unit Price: {formatCurrency(price)}
            {productInfo && (
              <span className="cart-item-stock-hint">
                (Stock: {stock})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="cart-item-qty-cell">
        <div className="qty-selector qty-selector-compact">
          <button
            type="button"
            className="qty-btn"
            onClick={handleDecrease}
            disabled={isUpdating || isDeleting}
            title={quantity === 1 ? 'Remove item' : 'Decrease quantity'}
          >
            {quantity === 1 ? '🗑️' : '-'}
          </button>

          <span className="qty-display">{quantity}</span>

          <button
            type="button"
            className="qty-btn"
            onClick={handleIncrease}
            disabled={quantity >= stock || isUpdating || isDeleting}
            title={quantity >= stock ? 'Maximum stock reached' : 'Increase quantity'}
          >
            +
          </button>
        </div>

        <div className="cart-item-subtotal">
          {formatCurrency(itemTotal)}
        </div>
      </div>

      {/* Requirement 3: Delete Button */}
      <div className="cart-item-actions">
        <button
          type="button"
          className="btn-icon-danger"
          onClick={() => onDelete(cartItemId, name)}
          disabled={isDeleting || isUpdating}
          title={`Delete Product #${productId} from Cart`}
          id={`delete-cart-item-btn-${cartItemId}`}
        >
          {isDeleting ? (
            <span className="spinner-sm" />
          ) : (
            <span>🗑️</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default CartItem;
