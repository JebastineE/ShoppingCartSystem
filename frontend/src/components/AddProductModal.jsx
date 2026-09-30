import React, { useState } from 'react';

/**
 * AddProductModal Component
 * Provides a form to add a new product via POST /api/products
 */
function AddProductModal({ isOpen, onClose, onAddProduct, suggestedId = 1 }) {
  const [productId, setProductId] = useState(suggestedId);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Update suggested ID when opened or changed
  React.useEffect(() => {
    if (isOpen) {
      setProductId(suggestedId);
      setName('');
      setPrice('');
      setStock('10');
      setFormError('');
    }
  }, [isOpen, suggestedId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!productId || isNaN(productId) || Number(productId) <= 0) {
      setFormError('Please enter a valid numeric Product ID.');
      return;
    }
    if (!name.trim()) {
      setFormError('Please enter a product name.');
      return;
    }
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      setFormError('Please enter a valid positive price.');
      return;
    }
    if (stock === '' || isNaN(stock) || parseInt(stock, 10) < 0) {
      setFormError('Please enter a valid stock quantity (0 or greater).');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddProduct({
        productId: Number(productId),
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      });
      onClose();
    } catch (err) {
      setFormError(err.message || 'Failed to create product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">➕</span>
            <h3 className="modal-title">Add New Product</h3>
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

        <form onSubmit={handleSubmit} className="modal-form">
          {formError && (
            <div className="form-alert-error" role="alert">
              ⚠️ {formError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="prod-id" className="form-label">
              Product ID <span className="text-danger">*</span>
            </label>
            <input
              id="prod-id"
              type="number"
              className="form-control"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              min="1"
              required
            />
            <span className="form-hint">Unique numerical identifier in database</span>
          </div>

          <div className="form-group">
            <label htmlFor="prod-name" className="form-label">
              Product Name <span className="text-danger">*</span>
            </label>
            <input
              id="prod-name"
              type="text"
              className="form-control"
              placeholder="e.g. Wireless Mouse, 4K Monitor..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-price" className="form-label">
                Price (₹) <span className="text-danger">*</span>
              </label>
              <input
                id="prod-price"
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                placeholder="e.g. 1500.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-stock" className="form-label">
                Initial Stock <span className="text-danger">*</span>
              </label>
              <input
                id="prod-stock"
                type="number"
                min="0"
                className="form-control"
                placeholder="e.g. 20"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="submit-add-product-btn"
            >
              {isSubmitting ? 'Saving...' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
