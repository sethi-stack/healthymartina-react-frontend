import axios from 'axios';

/**
 * API Client Configuration
 * Base axios instance with interceptors for authentication
 */

// Get API base URL from environment or default to localhost
const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// Create axios instance
export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	timeout: 30000, // 30 seconds
});

/**
 * Request interceptor - Add auth token to requests
 */
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('auth_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

/**
 * Response interceptor - Handle errors and token refresh
 */
apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		// Handle 401 Unauthorized - token expired or invalid
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			// Clear auth data
			localStorage.removeItem('auth_token');
			localStorage.removeItem('auth_user');

			// Redirect to login if not already there
			if (window.location.pathname !== '/login') {
				window.location.href = '/login';
			}
		}

		// Handle 422 Validation errors
		if (error.response?.status === 422) {
			// Validation errors are handled by the calling code
			return Promise.reject(error);
		}

		// Handle network errors
		if (!error.response) {
			return Promise.reject({
				message: 'Network error. Please check your connection.',
				isNetworkError: true,
			});
		}

		return Promise.reject(error);
	}
);

export default apiClient;
