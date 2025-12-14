import apiClient from './client';

/**
 * Get recipes with pagination and filtering
 * @param {Object} params - Query parameters (page, filter, tags, etc.)
 * @returns {Promise<Object>} - Response with data and pagination info
 */
export const getRecipes = async (params = {}) => {
	const response = await apiClient.get('/recipes', { params });
	return response.data;
};

/**
 * Get single recipe by slug
 * @param {string} slug - Recipe slug
 * @returns {Promise<Object>} - Recipe data
 */
export const getRecipeBySlug = async (slug) => {
	const response = await apiClient.get(`/recipes/${slug}`);
	return response.data;
};

