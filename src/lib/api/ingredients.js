import apiClient from './client';

/**
 * Ingredient API endpoints
 */
export const getIngredients = async (params = {}) => {
	const response = await apiClient.get('/ingredients', { params });
	return response.data;
};

export const getIngredient = async (id) => {
	const response = await apiClient.get(`/ingredients/${id}`);
	return response.data;
};

