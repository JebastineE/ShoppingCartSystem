import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

/**
 * ProductList Component
 * Displays the product catalog fetched from GET /api/products,
 * with search, filtering, refresh, and Add to Cart handling.
 */
function ProductList({
  products = [],
  loading = false,
  error = null,
  onRefresh,
  onAddToCart,
  onDeleteProduct,
  onOpenAddModal,
  addingProductId = null,
  deletingProductId = null,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'in-stock', 'low-stock', 'out-of-stock'

  // Filter products based on search term and stock filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.productId).includes(searchTerm);

      if (!matchesSearch) return false;

      if (stockFilter === 'in-stock') return p.stock > 0;
      if (stockFilter === 'low-stock') return p.stock > 0 && p.stock <= 5;
      if (stockFilter === 'out-of-stock') return p.stock <= 0;
      return true;
    });
  }, [products, searchTerm, stockFilter]);

  return (
    <section className="product-list-section" aria-labelledby="products-heading">
      {/* Section Header */}
      <div className="section-header-row">
        <div>
          <div className="section-tag">CATALOG</div>
          <h2 id="products-heading" className="section-title">
            Available Products
          </h2>
          <p className="section-subtitle">
            Browse items from our store and add them to your shopping cart.
          </p>
        </div>

        <div className="section-header-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh product list from Spring Boot API"
          >
            <span className={loading ? 'spinning' : ''}>🔄</span>
            <span>Refresh</span>
          </button>

          {onOpenAddModal && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenAddModal}
              id="add-new-product-btn"
            >
              <span>+</span>
              <span>New Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by product name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="product-search-input"
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

        {/* Stock Filter Pills */}
        <div className="filter-pills" role="radiogroup" aria-label="Filter by stock">
          <button
            type="button"
            className={`filter-pill ${stockFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStockFilter('all')}
          >
            All ({products.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${stockFilter === 'in-stock' ? 'active' : ''}`}
            onClick={() => setStockFilter('in-stock')}
          >
            In Stock ({products.filter((p) => p.stock > 0).length})
          </button>
          <button
            type="button"
            className={`filter-pill ${stockFilter === 'low-stock' ? 'active' : ''}`}
            onClick={() => setStockFilter('low-stock')}
          >
            Low Stock ({products.filter((p) => p.stock > 0 && p.stock <= 5).length})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && products.length === 0 && (
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">Loading products from backend (GET /api/products)...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div className="error-details">
            <h3 className="error-title">Failed to load products</h3>
            <p className="error-message">{error}</p>
            <p className="error-hint">
              Check if Spring Boot backend is active at <code>http://localhost:8083</code>.
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onRefresh}>
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">
            {searchTerm || stockFilter !== 'all' ? 'No matching products found' : 'No products available'}
          </h3>
          <p className="empty-subtitle">
            {searchTerm || stockFilter !== 'all'
              ? 'Try adjusting your search keywords or stock filter.'
              : 'Add your first product to get started!'}
          </p>
          {(searchTerm || stockFilter !== 'all') && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setSearchTerm('');
                setStockFilter('all');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className="product-grid" id="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onAddToCart={onAddToCart}
              onDeleteProduct={onDeleteProduct}
              isAdding={addingProductId === product.productId}
              isDeleting={deletingProductId === product.productId}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
