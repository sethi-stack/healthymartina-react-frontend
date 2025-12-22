import { apiClient } from './client';

/**
 * Calendar API endpoints
 * Calendar-related API calls
 */

/**
 * Get list of user's calendars
 * @param {Object} params - Query parameters (page, per_page)
 * @returns {Promise<Object>} - Response with calendars array
 */
export const getCalendars = async (params = {}) => {
	const response = await apiClient.get('/calendars', { params });
	return response.data;
};

/**
 * Get single calendar by ID
 * @param {number} id - Calendar ID
 * @returns {Promise<Object>} - Calendar data
 */
export const getCalendar = async (id) => {
	const response = await apiClient.get(`/calendars/${id}`);
	return response.data;
};

/**
 * Create a new calendar
 * @param {Object} data - Calendar data
 * @param {string} data.nombre - Calendar name
 * @param {number} data.semanas - Number of weeks (optional)
 * @param {Object} data.calendario - Calendar JSON (optional)
 * @param {Object} data.data_semanal - Weekly data JSON (optional)
 * @returns {Promise<Object>} - Created calendar
 */
export const createCalendar = async (data) => {
	const response = await apiClient.post('/calendars', data);
	return response.data;
};

/**
 * Update calendar
 * @param {number} id - Calendar ID
 * @param {Object} data - Calendar data to update
 * @returns {Promise<Object>} - Updated calendar
 */
export const updateCalendar = async (id, data) => {
	const response = await apiClient.put(`/calendars/${id}`, data);
	return response.data;
};

/**
 * Delete calendar
 * @param {number} id - Calendar ID
 * @returns {Promise<Object>} - Response
 */
export const deleteCalendar = async (id) => {
	const response = await apiClient.delete(`/calendars/${id}`);
	return response.data;
};

/**
 * Copy calendar
 * @param {number} id - Calendar ID to copy
 * @param {string} nombre - New calendar name
 * @returns {Promise<Object>} - Copied calendar
 */
export const copyCalendar = async (id, nombre) => {
	const response = await apiClient.post(`/calendars/${id}/copy`, { nombre });
	return response.data;
};

/**
 * Get calendar schedules (for dropdown/selection)
 * @returns {Promise<Object>} - Calendar schedules data
 */
export const getCalendarSchedules = async () => {
	const response = await apiClient.get('/calendars/schedules');
	return response.data;
};

/**
 * Add recipe to calendar
 * @param {number} calendarId - Calendar ID
 * @param {Object} data - Recipe data
 * @param {number} data.recetaid - Recipe ID
 * @param {string} data.mealtype - 'main' or 'side'
 * @param {string} data.mealnum - Meal number (e.g., 'meal_1')
 * @param {Array<string>} data.daynum - Array of day keys (e.g., ['day_1', 'day_2'])
 * @param {number} data.porciones - Number of servings
 * @param {boolean} data.leftover - Is leftover
 * @returns {Promise<Object>} - Response
 */
export const addRecipeToCalendar = async (calendarId, data) => {
	const response = await apiClient.post(`/calendars/${calendarId}/recipes`, data);
	return response.data;
};

/**
 * Update recipe in calendar
 * @param {number} calendarId - Calendar ID
 * @param {Object} data - Recipe update data
 * @returns {Promise<Object>} - Response
 */
export const updateRecipeInCalendar = async (calendarId, data) => {
	const response = await apiClient.put(`/calendars/${calendarId}/recipes`, data);
	return response.data;
};

/**
 * Remove recipe from calendar
 * @param {number} calendarId - Calendar ID
 * @param {Object} data - Removal data
 * @param {string} data.daynum - Day number (e.g., 'day_1')
 * @param {string} data.mealnum - Meal number (e.g., 'meal_1')
 * @param {string} data.mealtype - 'main' or 'side'
 * @returns {Promise<Object>} - Response
 */
export const removeRecipeFromCalendar = async (calendarId, data) => {
	const response = await apiClient.delete(`/calendars/${calendarId}/recipes`, { data });
	return response.data;
};

/**
 * Update calendar labels (days or meals)
 * @param {number} calendarId - Calendar ID
 * @param {Object} data - Label data
 * @param {string} data.label_type - 'days' or 'meals'
 * @param {Array<string>} data.label_name - Array of label names
 * @returns {Promise<Object>} - Response
 */
export const updateCalendarLabels = async (calendarId, data) => {
	const response = await apiClient.post(`/calendars/${calendarId}/labels`, data);
	return response.data;
};

/**
 * Get calendar nutritional info for a day
 * @param {number} calendarId - Calendar ID
 * @param {string} dayId - Day key (e.g., 'day_1')
 * @returns {Promise<Object>} - Nutritional information
 */
export const getCalendarNutrition = async (calendarId, dayId) => {
	const response = await apiClient.get(`/calendars/${calendarId}/nutrition/${dayId}`);
	return response.data;
};

/**
 * Export calendar as PDF
 * @param {Object} data - Export data
 * @param {number} data.calendar - Calendar ID
 * @param {Array<number>} data.export_param - Export options [1=calendar, 2=lista, 3=notes, 4=nutrition]
 * @param {Array<number>} data.receta1 - Recipe IDs to include
 * @param {number} data.receta_cover - Cover recipe ID (optional)
 * @param {string} data.content - Template content (optional)
 * @param {boolean} data.leftover - Include leftovers (optional)
 * @returns {Promise<Blob>} - PDF blob
 */
export const exportCalendarPdf = async (data) => {
	const response = await apiClient.post('/calendars/export/pdf', data, {
		responseType: 'blob',
	});
	return response.data;
};

/**
 * Get lista (ingredient list) for calendar
 * @param {number} calendarId - Calendar ID
 * @returns {Promise<Object>} - Lista data
 */
export const getCalendarLista = async (calendarId) => {
	const response = await apiClient.get(`/calendars/${calendarId}/lista`);
	return response.data;
};

/**
 * Export lista as PDF
 * @param {number} calendarId - Calendar ID
 * @returns {Promise<Blob>} - PDF blob
 */
export const exportListaPdf = async (calendarId) => {
	const response = await apiClient.get(`/calendars/${calendarId}/lista/pdf`, {
		responseType: 'blob',
	});
	return response.data;
};

