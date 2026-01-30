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

/**
 * Add or update reaction to a recipe
 * @param {number} recipeId - Recipe ID
 * @param {boolean} isLike - true for like, false for dislike
 * @returns {Promise<Object>} - Response with reaction data
 */
export const addRecipeReaction = async (recipeId, isLike) => {
	const response = await apiClient.post(`/recipes/${recipeId}/react`, {
		is_like: isLike,
	});
	return response.data;
};

/**
 * Remove reaction from a recipe
 * @param {number} recipeId - Recipe ID
 * @returns {Promise<Object>} - Response
 */
export const removeRecipeReaction = async (recipeId) => {
	const response = await apiClient.delete(`/recipes/${recipeId}/react`);
	return response.data;
};

/**
 * Get comments for a recipe
 * @param {number} recipeId - Recipe ID
 * @returns {Promise<Object>} - Response with comments array
 */
export const getRecipeComments = async (recipeId) => {
	const response = await apiClient.get(`/recipes/${recipeId}/comments`);
	return response.data;
};/**
 * Add a comment to a recipe
 * @param {number} recipeId - Recipe ID
 * @param {string} comment - Comment text
 * @returns {Promise<Object>} - Response with comment data
 */
export const addRecipeComment = async (recipeId, comment) => {
	const response = await apiClient.post(`/recipes/${recipeId}/comments`, {
		comment,
	});
	return response.data;
};

/**
 * Delete a comment
 * @param {number} commentId - Comment ID
 * @returns {Promise<Object>} - Response
 */
export const deleteRecipeComment = async (commentId) => {
	const response = await apiClient.delete(`/recipes/comments/${commentId}`);
	return response.data;
};

/**
 * Get filter metadata (tags, ingredients, nutrient types, defaults)
 * @returns {Promise<Object>} - Filter metadata
 */
export const getFilterMetadata = async () => {
	const response = await apiClient.get('/recipes/filter-metadata');
	return response.data;
};

/**
 * Apply advanced filtering to recipes
 * @param {Object} filters - Filter parameters
 * @param {number} page - Page number (default: 1)
 * @param {number} perPage - Items per page (default: 27)
 * @returns {Promise<Object>} - Filtered recipes with pagination
 */
export const getAdvancedFilteredRecipes = async (
	filters = {},
	page = 1,
	perPage = 27
) => {
	const response = await apiClient.post('/recipes/advanced-filter', {
		...filters,
		page,
		per_page: perPage,
	});
	return response.data;
};