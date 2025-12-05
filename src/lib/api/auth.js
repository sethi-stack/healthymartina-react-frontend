import { apiClient } from './client';

/**
 * Auth API endpoints
 * Authentication-related API calls
 */

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise} API response with user and token
 */
export const login = async ({ email, password }) => {
	const response = await apiClient.post('/auth/login', {
		email,
		password,
	});
	return response.data;
};

/**
 * Register new user
 * @param {Object} userData - Registration data
 * @param {string} userData.name - User first name
 * @param {string} userData.last_name - User last name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.password_confirmation - Password confirmation
 * @returns {Promise} API response with user and token
 */
export const register = async ({
	name,
	last_name,
	email,
	password,
	password_confirmation,
}) => {
	const response = await apiClient.post('/auth/register', {
		name,
		last_name,
		email,
		password,
		password_confirmation,
	});
	return response.data;
};

/**
 * Logout user
 * @returns {Promise} API response
 */
export const logout = async () => {
	const response = await apiClient.post('/auth/logout');
	return response.data;
};

/**
 * Get current authenticated user
 * @returns {Promise} API response with user data
 */
export const getCurrentUser = async () => {
	const response = await apiClient.get('/auth/user');
	return response.data;
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} API response
 */
export const forgotPassword = async (email) => {
	const response = await apiClient.post('/auth/password/forgot', {
		email,
	});
	return response.data;
};
