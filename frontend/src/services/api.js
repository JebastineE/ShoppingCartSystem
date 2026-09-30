import { API_BASE_URL } from '../config';

/**
 * Parses response body safely as JSON if content-type is json,
 * otherwise as plain text.
 */
async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  return await response.text();
}

/**
 * Robust fetch wrapper that calls the Spring Boot API.
 * In development, if direct CORS fetch fails against localhost:8083,
 * it transparently retries via Vite's proxy to guarantee zero CORS failures.
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, options);
    const data = await parseResponse(response);

    if (!response.ok) {
      const errorMsg =
        (data && typeof data === 'object' && (data.message || data.error)) ||
        (typeof data === 'string' && data.length > 0
          ? data
          : `Request failed with status ${response.status}`);
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    // If it's a TypeError ("Failed to fetch" usually triggered by CORS or connection refused)
    // and we attempted a direct host call, try the local dev proxy route
    if (
      err.name === 'TypeError' &&
      API_BASE_URL &&
      API_BASE_URL.startsWith('http')
    ) {
      try {
        console.warn(
          `Direct fetch to ${url} failed (likely CORS). Retrying through Vite dev proxy for ${endpoint}...`
        );
        const proxyResponse = await fetch(endpoint, options);
        const proxyData = await parseResponse(proxyResponse);

        if (!proxyResponse.ok) {
          const errorMsg =
            (proxyData &&
              typeof proxyData === 'object' &&
              (proxyData.message || proxyData.error)) ||
            (typeof proxyData === 'string' && proxyData.length > 0
              ? proxyData
              : `Request failed with status ${proxyResponse.status}`);
          throw new Error(errorMsg);
        }

        return proxyData;
      } catch (proxyErr) {
        throw new Error(
          `Cannot connect to Spring Boot backend at ${API_BASE_URL}. Ensure it is running on port 8083. (${proxyErr.message})`
        );
      }
    }

    throw err;
  }
}

// ==========================================
// 1. PRODUCT APIs
// ==========================================

/**
 * GET /api/products
 * Fetch all available products from the store.
 */
export async function getProducts() {
  return apiFetch('/api/products');
}

/**
 * GET /api/products/{id}
 * Fetch details of a single product by ID.
 */
export async function getProductById(id) {
  return apiFetch(`/api/products/${id}`);
}

/**
 * POST /api/products
 * Add a new product to the catalog.
 * @param {Object} product - { productId, name, price, stock }
 */
export async function createProduct(product) {
  return apiFetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: Number(product.productId),
      name: product.name.trim(),
      price: parseFloat(product.price),
      stock: parseInt(product.stock, 10),
    }),
  });
}

/**
 * DELETE /api/products/{id}
 * Delete a product by its ID.
 */
export async function deleteProduct(id) {
  return apiFetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
}

// ==========================================
// 2. CART APIs
// ==========================================

/**
 * GET /api/cart
 * Fetch all items currently in the shopping cart.
 */
export async function getCart() {
  return apiFetch('/api/cart');
}

/**
 * GET /api/cart/{id}
 * Fetch a single cart item by cartItemId.
 */
export async function getCartItemById(id) {
  return apiFetch(`/api/cart/${id}`);
}

/**
 * POST /api/cart
 * Add or update an item in the shopping cart.
 * Note: CartItem entity uses cartItemId as its @Id.
 * @param {Object} cartItem - { cartItemId, productId, quantity }
 */
export async function addToCart({ cartItemId, productId, quantity }) {
  return apiFetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cartItemId: Number(cartItemId),
      productId: Number(productId),
      quantity: Number(quantity),
    }),
  });
}

/**
 * DELETE /api/cart/{id}
 * Remove an item from the cart by its cartItemId.
 */
export async function deleteCartItem(id) {
  return apiFetch(`/api/cart/${id}`, {
    method: 'DELETE',
  });
}

// ==========================================
// 3. ORDER APIs
// ==========================================

/**
 * GET /api/orders
 * Fetch all previously placed orders.
 */
export async function getOrders() {
  return apiFetch('/api/orders');
}

/**
 * GET /api/orders/{id}
 * Fetch a single order by orderId.
 */
export async function getOrderById(id) {
  return apiFetch(`/api/orders/${id}`);
}

/**
 * POST /api/orders/checkout
 * Trigger checkout: transfers cart items to orders, decrements product stock,
 * and clears the cart via the backend stored procedure.
 */
export async function checkout() {
  return apiFetch('/api/orders/checkout', {
    method: 'POST',
  });
}
