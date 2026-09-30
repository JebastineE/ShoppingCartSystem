# Shopping Cart System - React + Vite Frontend

A modern, responsive, and beginner-friendly React + Vite frontend for the Shopping Cart System, powered by a Spring Boot REST API.

---

## 🚀 Features

1. **Header**:
   - Displays "Shopping Cart System".
   - Navigation tabs: **Products**, **Cart** (with live quantity badge), and **Orders**.
   - Quick **+ Add Product** modal button.
   - Real-time **Backend Connection Status** indicator.

2. **Product Catalog**:
   - Fetches products from `GET /api/products`.
   - Displays product name, formatted price (₹), available stock badge, and tech emoji icons.
   - Real-time search by name/ID and stock status filters (*All*, *In Stock*, *Low Stock*).
   - Quantity selector with stock boundary checks.
   - **Add to Cart** button with loading feedback.
   - Option to delete products via `DELETE /api/products/{id}`.

3. **Shopping Cart Section**:
   - Fetches cart items from `GET /api/cart`.
   - Prominently displays the **Product ID**, product name, and unit price.
   - Interactive quantity adjuster (+ / -) that updates cart via `POST /api/cart`.
   - **Delete button** that removes items via `DELETE /api/cart/{id}`.
   - Subtotal per item and overall order summary calculation.

4. **Checkout Flow**:
   - Prominent **Proceed to Checkout** button calling `POST /api/orders/checkout`.
   - Triggers the database stored procedure (`CALL checkout()`), updating stock in PostgreSQL, clearing the cart, and creating an order.
   - Switches automatically to the **Orders** tab upon successful order placement.

5. **Previous Orders Section**:
   - Fetches order history from `GET /api/orders`.
   - Order metrics: Total Orders Placed, Cumulative Total Spent, and Average Order Value.
   - Shows Order ID, order date, total amount, and completed status badge.
   - **View Details** modal calling `GET /api/orders/{id}`.

6. **State & Error Feedback**:
   - Loading spinners during API requests.
   - Informative error banners with retry buttons if the backend is unreachable.
   - Toast notification alerts for actions (add to cart, delete, checkout).

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 8
- **Language**: JavaScript (ES Modules)
- **Styling**: Vanilla CSS (custom design system with CSS custom properties, cards, glassmorphism, responsive grid)
- **Typography**: Google Fonts (*Plus Jakarta Sans*)
- **Networking**: Native `fetch()` API with automatic CORS handling and dev proxy fallback

---

## 📂 Project Structure

```
shopping-cart-frontend/
├── index.html                  # HTML entry point with Plus Jakarta Sans & SEO tags
├── package.json                # Project dependencies & scripts
├── vite.config.js              # Vite configuration with /api proxy to port 8083
├── .env.example                # Example environment variable for deployment
├── src/
│   ├── config.js               # Centralized backend URL configuration constant
│   ├── main.jsx                # Application root mount
│   ├── App.jsx                 # Main state coordinator & view router
│   ├── index.css               # Complete modern CSS design system
│   ├── App.css                 # Custom component overrides
│   ├── api/
│   │   ├── config.js           # Re-export of config constant
│   │   └── shoppingApi.js      # Re-export of API services
│   ├── services/
│   │   └── api.js              # Centralized fetch wrapper for all Spring Boot endpoints
│   ├── utils/
│   │   └── formatters.js       # Currency (₹), date, and product icon utilities
│   └── components/
│       ├── Header.jsx          # Header with branding, nav tabs, & backend status
│       ├── StatusMessage.jsx   # Auto-dismissing toast alerts
│       ├── ProductList.jsx     # Product catalog grid with search & filters
│       ├── ProductCard.jsx     # Individual product card with Add to Cart button
│       ├── Cart.jsx            # Shopping cart table & order summary card
│       ├── CartItem.jsx        # Individual cart item row (Product ID, qty, delete)
│       ├── OrderList.jsx       # Order history list with summary metrics
│       ├── OrderCard.jsx       # Individual order card with details trigger
│       ├── AddProductModal.jsx # Form to add products via POST /api/products
│       └── OrderDetailsModal.jsx # Modal displaying GET /api/orders/{id}
```

---

## ⚙️ Configuration (Railway / Render Deployment)

The backend base URL is isolated in [src/config.js](file:///c:/Users/JEBASTINE%20E/Documents/shopping-cart-frontend/src/config.js):

```javascript
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083';
```

### Local Development
Defaults automatically to `http://localhost:8083`.
Vite also proxies all `/api/*` requests to `http://localhost:8083` in [vite.config.js](file:///c:/Users/JEBASTINE%20E/Documents/shopping-cart-frontend/vite.config.js).

### Deployment to Render / Railway / Vercel
Set the environment variable in your dashboard or in `.env`:

```env
VITE_API_BASE_URL=https://your-spring-boot-backend.up.railway.app
```

---

## 💻 Running the Application

1. **Start the Spring Boot Backend** (running on port 8083):
   ```bash
   # From your backend project directory
   mvn spring-boot:run
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```
