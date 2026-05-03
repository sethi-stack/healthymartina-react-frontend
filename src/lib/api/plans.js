import { apiClient } from './client';

/**
 * Get available meal plans for current user.
 * @returns {Promise<Object>}
 */
export const getMealPlans = async () => {
	const response = await apiClient.get('/plans');
	return response.data;
};

/**
 * Get meal plan details by ID.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getMealPlan = async (id) => {
	const response = await apiClient.get(`/plans/${id}`);
	return response.data;
};

/**
 * Copy a meal plan into user calendars.
 * @param {number} id
 * @param {Object} data
 * @param {string} data.calendar_title
 * @param {number} data.calendar_scale
 * @returns {Promise<Object>}
 */
export const copyMealPlan = async (id, data) => {
	const response = await apiClient.post(`/plans/${id}/copy`, data);
	return response.data;
};

/**
 * Download meal plan PDF.
 * @param {number} id
 * @returns {Promise<Blob>}
 */
export const downloadMealPlanPdf = async (id) => {
	const response = await apiClient.get(`/plans/${id}/pdf`, {
		responseType: 'blob',
	});
	return response.data;
};
