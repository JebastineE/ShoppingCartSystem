import React, { useState } from 'react';
import { formatCurrency, getProductIcon } from '../utils/formatters';

/**
 * ProductCard Component
 * Displays individual product information:
 * - Product Name
 * - Price
 * - Available Stock
 * - Add to Cart button
 */
function ProductCard({
  product,
  onAddToCart,
  onDeleteProduct,
  isAdding = false,
  isDeleting = false,
}) {
  const [selectedQty, setSelectedQty] = useState(1);

  const { productId, name, price, stock } = product;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleQtyChange = (delta) => {
    setSelectedQty((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > stock) return stock;
      return next;
    });
  };

  const handleAdd = () => {
    if (isOutOfStock || isAdding) return;
    onAddToCart(product, selectedQty);
  };

  return (
    <div className={`product-card ${isOutOfStock ? 'product-card-out-of-stock' : ''}`} id={`product-${productId}`}>
      {/* Top badges: Product ID and Stock status */}
      <div className="product-card-header">
        <span className="badge badge-neutral" title="Product ID">
          ID #{productId}
        </span>

        {isOutOfStock ? (
          <span className="badge badge-danger">Out of Stock</span>
        ) : isLowStock ? (
          <span className="badge badge-warning">Only {stock} left!</span>
        ) : (
          <span className="badge badge-success">In Stock ({stock})</span>
        )}
      </div>

      {/* Visual Product Icon */}
      <div className="product-icon-container">
        <span className="product-large-icon">{getProductIcon(name)}</span>
      </div>

      {/* Product Details */}
      <div className="product-body">
        <h3 className="product-name" title={name}>
          {name}
        </h3>

        <div className="product-pricing-row">
          <div className="product-price">{formatCurrency(price)}</div>
          <div className="product-stock-subtext">
            Stock: <strong>{stock}</strong> units
          </div>
        </div>
      </div>

      {/* Action Controls: Quantity & Add to Cart */}
      <div className="product-actions">
        {!isOutOfStock && (
          <div className="qty-selector" aria-label="Select quantity to add">
            <button
              type="button"
              className="qty-btn"
              onClick={() => handleQtyChange(-1)}
              disabled={selectedQty <= 1 || isAdding}
              title="Decrease quantity"
            >
              -
            </button>
            <input
              type="number"
              className="qty-input"
              value={selectedQty}
              min="1"
              max={stock}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) setSelectedQty(1);
                else if (val > stock) setSelectedQty(stock);
                else setSelectedQty(val);
              }}
              disabled={isAdding}
            />
            <button
              type="button"
              className="qty-btn"
              onClick={() => handleQtyChange(1)}
              disabled={selectedQty >= stock || isAdding}
              title="Increase quantity"
            >
              +
            </button>
          </div>
        )}

        <button
          type="button"
          className="btn btn-primary add-to-cart-btn"
          onClick={handleAdd}
          disabled={isOutOfStock || isAdding}
          id={`add-to-cart-btn-${productId}`}
        >
          {isAdding ? (
            <>
              <span className="spinner-sm" />
              <span>Adding...</span>
            </>
          ) : isOutOfStock ? (
            <span>Sold Out</span>
          ) : (
            <>
              <span>🛒</span>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Optional Admin/Manage Delete product */}
      {onDeleteProduct && (
        <div className="product-footer-links">
          <button
            type="button"
            className="text-danger-link"
            onClick={() => onDeleteProduct(productId, name)}
            disabled={isDeleting}
            title="Delete this product from catalog"
          >
            {isDeleting ? 'Deleting...' : '🗑️ Remove Product'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
