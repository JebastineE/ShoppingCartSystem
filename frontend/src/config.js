/**
 * Backend API Configuration
 *
 * LOCAL DEVELOPMENT:
 * Connects to the Spring Boot REST backend running on port 8083.
 * In development, Vite dev server proxies /api requests to http://localhost:8083
 * (configured in vite.config.js), ensuring zero browser CORS restrictions.
 *
 * PRODUCTION / CLOUD DEPLOYMENT (Railway, Render, AWS, Vercel, etc.):
 * Set the environment variable VITE_API_BASE_URL in your hosting platform dashboard.
 * Example: VITE_API_BASE_URL=https://shopping-backend-production.up.railway.app
 */
export const DEFAULT_BACKEND_URL = 'http://localhost:8083';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.DEV
    ? ''
    : DEFAULT_BACKEND_URL;

export default API_BASE_URL;
