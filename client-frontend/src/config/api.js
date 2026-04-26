/**
 * Central API base URL configuration.
 * In production, set VITE_API_URL to your deployed backend URL.
 * Locally, it falls back to http://localhost:5000.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
