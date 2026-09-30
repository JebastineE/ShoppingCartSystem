import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatusMessage from './components/StatusMessage';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderList from './components/OrderList';
import AddProductModal from './components/AddProductModal';
import OrderDetailsModal from './components/OrderDetailsModal';
import {
  getProducts,
  createProduct,
  deleteProduct,
  getCart,
  addToCart,
  deleteCartItem,
  getOrders,
  getOrderById,
  checkout,
} from './services/api';

/**
 * Main Application Component for Shopping Cart System
 *
 * Coordinates state and connects to the Spring Boot REST API:
 * - Products: GET, POST, DELETE
 * - Cart: GET, POST, DELETE
 * - Orders: GET, POST /checkout
 */
function App() {
  // Navigation State: 'products' | 'cart' | 'orders'
  const [activeTab, setActiveTab] = useState('products');

  // Backend connection status
  const [backendConnected, setBackendConnected] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  // Cart State
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [errorCart, setErrorCart] = useState(null);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  // Notification Toast State: { type: 'success' | 'error' | 'info', message: string } | null
  const [notification, setNotification] = useState(null);

  // Action Loading States
  const [addingProductId, setAddingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [deletingCartItemId, setDeletingCartItemId] = useState(null);
  const [updatingCartItemId, setUpdatingCartItemId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [viewingOrderId, setViewingOrderId] = useState(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // ==========================================
  // API FETCH FUNCTIONS
  // ==========================================

  /**
   * Fetch all products: GET /api/products
   */
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setBackendConnected(true);
    } catch (err) {
      console.error('Failed to load products:', err);
      setErrorProducts(err.message || 'Unable to connect to Spring Boot products API.');
      setBackendConnected(false);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  /**
   * Fetch all cart items: GET /api/cart
   */
  const loadCart = useCallback(async () => {
    setLoadingCart(true);
    setErrorCart(null);
    try {
      const data = await getCart();
      setCart(Array.isArray(data) ? data : []);
      setBackendConnected(true);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setErrorCart(err.message || 'Unable to connect to Spring Boot cart API.');
      setBackendConnected(false);
    } finally {
      setLoadingCart(false);
    }
  }, []);

  /**
   * Fetch all previous orders: GET /api/orders
   */
  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    setErrorOrders(null);
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
      setBackendConnected(true);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setErrorOrders(err.message || 'Unable to connect to Spring Boot orders API.');
      setBackendConnected(false);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Initial load on component mount
  useEffect(() => {
    loadProducts();
    loadCart();
    loadOrders();
  }, [loadProducts, loadCart, loadOrders]);

  // ==========================================
  // CART ACTIONS
  // ==========================================

  /**
   * Add a product to the shopping cart: POST /api/cart
   * If item already exists, updates quantity.
   */
  const handleAddToCart = async (product, quantityToAdd = 1) => {
    const { productId, name, stock } = product;

    // Check if product is already in the cart
    const existingItem = cart.find((item) => item.productId === productId);
    const newQuantity = existingItem ? existingItem.quantity + quantityToAdd : quantityToAdd;

    // Validate available stock
    if (newQuantity > stock) {
      setNotification({
        type: 'error',
        message: `Cannot add ${quantityToAdd} more unit(s). Total requested (${newQuantity}) exceeds stock (${stock}).`,
      });
      return;
    }

    // Determine cartItemId (CartItem entity requires manually assigned @Id)
    // If updating, reuse existing cartItemId; if new, generate a safe unique ID
    let cartItemId;
    if (existingItem) {
      cartItemId = existingItem.cartItemId;
    } else {
      const maxId = cart.reduce((max, item) => Math.max(max, Number(item.cartItemId) || 0), 0);
      cartItemId = maxId + 1;
    }

    setAddingProductId(productId);
    try {
      await addToCart({ cartItemId, productId, quantity: newQuantity });
      await loadCart();
      setNotification({
        type: 'success',
        message: `Added "${name}" (Qty: ${quantityToAdd}) to your cart!`,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      setNotification({
        type: 'error',
        message: `Failed to add "${name}" to cart: ${err.message}`,
      });
    } finally {
      setAddingProductId(null);
    }
  };

  /**
   * Update quantity of an item in cart: POST /api/cart
   */
  const handleUpdateCartQuantity = async (cartItemId, productId, newQty) => {
    if (newQty <= 0) {
      // If quantity becomes 0 or less, delete it
      handleDeleteCartItem(cartItemId, 'Item');
      return;
    }

    // Find product to check stock limit
    const product = products.find((p) => p.productId === productId);
    if (product && newQty > product.stock) {
      setNotification({
        type: 'error',
        message: `Cannot increase quantity. Available stock for "${product.name}" is ${product.stock}.`,
      });
      return;
    }

    setUpdatingCartItemId(cartItemId);
    try {
      await addToCart({ cartItemId, productId, quantity: newQty });
      await loadCart();
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      setNotification({
        type: 'error',
        message: `Failed to update quantity: ${err.message}`,
      });
    } finally {
      setUpdatingCartItemId(null);
    }
  };

  /**
   * Delete an item from cart: DELETE /api/cart/{id}
   */
  const handleDeleteCartItem = async (cartItemId, itemName = 'Item') => {
    setDeletingCartItemId(cartItemId);
    try {
      await deleteCartItem(cartItemId);
      await loadCart();
      setNotification({
        type: 'info',
        message: `${itemName} removed from cart.`,
      });
    } catch (err) {
      console.error('Error deleting cart item:', err);
      setNotification({
        type: 'error',
        message: `Failed to remove item from cart: ${err.message}`,
      });
    } finally {
      setDeletingCartItemId(null);
    }
  };

  // ==========================================
  // CHECKOUT ACTION
  // ==========================================

  /**
   * Process checkout: POST /api/orders/checkout
   * Calls Spring Boot stored procedure CALL checkout(), clears cart,
   * updates inventory, and creates new order.
   */
  const handleCheckout = async () => {
    if (cart.length === 0) {
      setNotification({
        type: 'error',
        message: 'Your cart is empty. Add products before checking out.',
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const responseMessage = await checkout();

      // Refresh all three resources as stock changed, cart emptied, and new order created
      await Promise.all([loadCart(), loadProducts(), loadOrders()]);

      setNotification({
        type: 'success',
        message: responseMessage || 'Checkout completed successfully! Your order has been placed.',
      });

      // Switch view to orders tab so the user sees their new order immediately
      setActiveTab('orders');
    } catch (err) {
      console.error('Error during checkout:', err);
      setNotification({
        type: 'error',
        message: `Checkout failed: ${err.message}`,
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ==========================================
  // PRODUCT MANAGEMENT ACTIONS
  // ==========================================

  /**
   * Add a new product to store: POST /api/products
   */
  const handleAddProduct = async (productData) => {
    await createProduct(productData);
    await loadProducts();
    setNotification({
      type: 'success',
      message: `Product "${productData.name}" (ID #${productData.productId}) added to catalog!`,
    });
  };

  /**
   * Delete a product: DELETE /api/products/{id}
   */
  const handleDeleteProduct = async (productId, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}" (ID #${productId}) from the catalog?`
    );
    if (!confirmed) return;

    setDeletingProductId(productId);
    try {
      await deleteProduct(productId);
      await Promise.all([loadProducts(), loadCart()]);
      setNotification({
        type: 'info',
        message: `Product "${name}" deleted successfully.`,
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      setNotification({
        type: 'error',
        message: `Failed to delete product: ${err.message}`,
      });
    } finally {
      setDeletingProductId(null);
    }
  };

  // ==========================================
  // ORDER ACTIONS
  // ==========================================

  /**
   * View details for a single order: GET /api/orders/{id}
   */
  const handleViewOrderDetails = async (orderId) => {
    setViewingOrderId(orderId);
    try {
      const order = await getOrderById(orderId);
      if (order) {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
      } else {
        setNotification({
          type: 'error',
          message: `Order #${orderId} not found.`,
        });
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setNotification({
        type: 'error',
        message: `Failed to fetch order details: ${err.message}`,
      });
    } finally {
      setViewingOrderId(null);
    }
  };

  // Calculate suggested product ID for modal
  const suggestedNextProductId =
    products.length > 0
      ? Math.max(...products.map((p) => Number(p.productId) || 0)) + 1
      : 1;

  // Calculate total items in cart for header badge
  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="app-wrapper">
      {/* Toast Notification Banner */}
      <StatusMessage
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* 1. Header with 'Shopping Cart System' */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        productCount={products.length}
        orderCount={orders.length}
        backendConnected={backendConnected}
        onOpenAddProduct={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="main-content">
        {/* TAB 1: Product List Section */}
        {activeTab === 'products' && (
          <ProductList
            products={products}
            loading={loadingProducts}
            error={errorProducts}
            onRefresh={loadProducts}
            onAddToCart={handleAddToCart}
            onDeleteProduct={handleDeleteProduct}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            addingProductId={addingProductId}
            deletingProductId={deletingProductId}
          />
        )}

        {/* TAB 2: Shopping Cart & Checkout Section */}
        {activeTab === 'cart' && (
          <Cart
            cartItems={cart}
            products={products}
            loading={loadingCart}
            error={errorCart}
            onRefresh={loadCart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onDeleteCartItem={handleDeleteCartItem}
            onCheckout={handleCheckout}
            onNavigateToProducts={() => setActiveTab('products')}
            isCheckingOut={isCheckingOut}
            deletingCartItemId={deletingCartItemId}
            updatingCartItemId={updatingCartItemId}
          />
        )}

        {/* TAB 3: Orders Section */}
        {activeTab === 'orders' && (
          <OrderList
            orders={orders}
            loading={loadingOrders}
            error={errorOrders}
            onRefresh={loadOrders}
            onViewDetails={handleViewOrderDetails}
            onNavigateToProducts={() => setActiveTab('products')}
            viewingOrderId={viewingOrderId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <p>
            <strong>Shopping Cart System</strong> &bull; Powered by Spring Boot REST API &amp; React Vite
          </p>
          <p className="footer-subtext">
            Endpoints active: <code>/api/products</code>, <code>/api/cart</code>, <code>/api/orders</code>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
        suggestedId={suggestedNextProductId}
      />

      <OrderDetailsModal
        isOpen={isOrderModalOpen}
        order={selectedOrder}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}

export default App;
