/**
 * Central API base URL configuration.
 * - If VITE_API_URL is set, always use it.
 * - In production without VITE_API_URL, use same-origin so `/api/*` works
 *   when frontend and backend are served from the same domain.
 * - In local development, default to the backend dev port.
 */
const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = envApiUrl || (import.meta.env.PROD ? "" : "http://localhost:5000");

export default API_URL;
