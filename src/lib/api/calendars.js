import { apiClient } from './client';

const USE_EXTERNAL_EXPORT_API =
	import.meta.env.VITE_USE_EXTERNAL_EXPORT_API === 'true';
const EXPORT_POLL_INTERVAL_MS = 2000;
const EXPORT_MAX_POLLS = 120;

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
 * @param {string} data.title - Calendar name
 * @param {number} data.semanas - Number of weeks (optional)
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
 * @param {string} title - New calendar name
 * @returns {Promise<Object>} - Copied calendar
 */
export const copyCalendar = async (id, title) => {
	const response = await apiClient.post(`/calendars/${id}/copy`, { title });
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
 * Update ración/scale for a meal slot.
 * @param {number} calendarId - Calendar ID
 * @param {Object} data - Ración update data
 * @param {'main'|'side'} data.meal_type
 * @param {string} data.meal_id - meal key (e.g. meal_1)
 * @param {string} data.day_id - day key (e.g. day_1)
 * @param {number} data.serving - current serving value
 * @param {number} data.calendar_scale - ración scale value
 * @returns {Promise<Object>}
 */
export const updateCalendarRacion = async (calendarId, data) => {
	const response = await apiClient.post(`/calendars/${calendarId}/racion`, data);
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
export const getCalendarNutrition = async (calendarId, dayId, params = {}) => {
	const response = await apiClient.get(`/calendars/${calendarId}/nutrition/${dayId}`, {
		params,
	});
	return response.data;
};

/**
 * Export calendar as PDF
 * @param {Object} data - Export data
 * @param {number} data.calendar - Calendar ID
 * @param {Array<number>} data.export_param - Export options [1=calendar, 2=lista, 3=notes, 4=nutrition]
 * @param {number} data.hero_recipe_id - Hero/cover recipe ID (optional)
 * @param {Array<number>} data.selected_recipes - Recipe IDs to include as full recipe pages (optional)
 * @param {string} data.template - PDF template name (`classic`, `modern`, or `bold`)
 * @returns {Promise<Blob>} - PDF blob
 */
export const exportCalendarPdf = async (data) => {
	const response = await apiClient.post('/calendars/export/pdf', data, {
		responseType: 'blob',
		timeout: 180000,
	});
	return response.data;
};

/**
 * Start async calendar PDF export job
 * @param {Object} data - Export payload
 * @returns {Promise<{success: boolean, job_id: string, status: string}>}
 */
export const startCalendarPdfExportJob = async (data) => {
	const response = await apiClient.post('/calendars/export/pdf/start', data, {
		timeout: 30000,
	});
	return response.data;
};

/**
 * Read async calendar PDF export status
 * @param {string} jobId
 * @returns {Promise<{status: string, progress?: number, error?: string, file_url?: string}>}
 */
export const getCalendarPdfExportJobStatus = async (jobId) => {
	const response = await apiClient.get(`/calendars/export/pdf/jobs/${jobId}`, {
		timeout: 30000,
	});
	return response.data;
};

/**
 * Download completed async calendar PDF export
 * @param {string} jobId
 * @returns {Promise<Blob>}
 */
export const downloadCalendarPdfExportJob = async (jobId) => {
	const response = await apiClient.get(`/calendars/export/pdf/jobs/${jobId}/download`, {
		responseType: 'blob',
		timeout: 180000,
	});
	return response.data;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const exportCalendarPdfViaAsyncJob = async (
	payload,
	{ pollIntervalMs = EXPORT_POLL_INTERVAL_MS, maxPolls = EXPORT_MAX_POLLS } = {}
) => {
	const startResponse = await startCalendarPdfExportJob(payload);
	const jobId = startResponse?.job_id;
	if (!jobId) {
		throw new Error('No se pudo iniciar la exportación.');
	}

	for (let attempt = 0; attempt < maxPolls; attempt += 1) {
		const statusResponse = await getCalendarPdfExportJobStatus(jobId);
		const status = statusResponse?.status;

		if (status === 'completed') {
			return await downloadCalendarPdfExportJob(jobId);
		}

		if (status === 'failed') {
			throw new Error(
				statusResponse?.error_message ||
					statusResponse?.error ||
					'La exportación falló.'
			);
		}

		await sleep(pollIntervalMs);
	}

	throw new Error('La exportación tardó demasiado. Intenta de nuevo.');
};

/**
 * Email calendar as PDF
 * @param {Object} data - Export data
 * @returns {Promise<Object>} - Response
 */
export const sendCalendarPdfEmail = async (data) => {
	const response = await apiClient.post('/calendars/export/pdf/email', data, {
		timeout: 180000,
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
	if (USE_EXTERNAL_EXPORT_API) {
		return await exportCalendarPdfViaAsyncJob({
			calendar: calendarId,
			export_param: [2],
			template: 'bold',
		});
	}

	const response = await apiClient.get(`/calendars/${calendarId}/lista/pdf`, {
		responseType: 'blob',
	});
	return response.data;
};

/**
 * Get lista data for calendar (categories and taken ingredients)
 * @param {number} calendarId - Calendar ID
 * @returns {Promise<Object>} - Lista data with categories and taken ingredients
 */
export const getListaData = async (calendarId) => {
	const response = await apiClient.get(`/calendars/${calendarId}/lista/data`);
	return response.data;
};

/**
 * Get all ingredients across all categories for a calendar
 * @param {number} calendarId - Calendar ID
 * @returns {Promise<Object>} - All ingredients grouped by category
 */
export const getAllListaIngredients = async (calendarId) => {
	const response = await apiClient.get(`/calendars/${calendarId}/lista/`);
	return response.data;
};

/**
 * Get ingredients for specific category
 * @param {number} calendarId - Calendar ID
 * @param {number} categoryId - Category ID
 * @returns {Promise<Object>} - Ingredients for the category
 */
export const getCategoryIngredients = async (calendarId, categoryId) => {
	const response = await apiClient.get(
		`/calendars/${calendarId}/lista/categories/${categoryId}`
	);
	return response.data;
};

/**
 * Toggle ingredient "taken" status
 * @param {number} calendarId - Calendar ID
 * @param {Object} data - Toggle data
 * @param {number} data.ingredientId - Ingredient ID
 * @param {number} data.categoryId - Category ID
 * @param {string} data.type - 'receta' or 'manual'
 * @returns {Promise<Object>} - Updated taken list
 */
export const toggleIngredientTaken = async (calendarId, data) => {
	const response = await apiClient.post(
		`/calendars/${calendarId}/lista/toggle-taken`,
		{
		ingrediente_id: data.ingredientId,
		categoria_id: data.categoryId,
		ingrediente_type: data.type,
		}
	);
	return response.data;
};

/**
 * Add manual ingredient to lista
 * @param {number} calendarId - Calendar ID
 * @param {Object} data - Ingredient data
 * @param {number} data.cantidad - Quantity
 * @param {string} data.unidad_medida - Unit of measure
 * @param {string} data.nombre - Ingredient name
 * @param {number} data.categoria - Category ID
 * @returns {Promise<Object>} - Created ingredient
 */
export const addListaIngredient = async (calendarId, data) => {
	const response = await apiClient.post(
		`/calendars/${calendarId}/lista/items`,
		{
			cantidad: data.cantidad,
			unidad_medida: data.unidad_medida,
			nombre: data.nombre,
			categoria: data.categoria,
		}
	);
	return response.data;
};

/**
 * Update manual ingredient
 * @param {number} ingredientId - Ingredient ID
 * @param {Object} data - Ingredient data
 * @param {number} data.cantidad - Quantity
 * @param {string} data.unidad_medida - Unit of measure
 * @param {string} data.nombre - Ingredient name
 * @param {number} data.categoria - Category ID
 * @returns {Promise<Object>} - Updated ingredient
 */
export const updateListaIngredient = async (ingredientId, data) => {
	const response = await apiClient.put(
		`/calendars/${data.calendarId}/lista/items/${ingredientId}`,
		{
			cantidad: data.cantidad,
			unidad_medida: data.unidad_medida,
			nombre: data.nombre,
			categoria: data.categoria,
		}
	);
	return response.data;
};

/**
 * Delete manual ingredient
 * @param {number} ingredientId - Ingredient ID
 * @returns {Promise<Object>} - Response
 */
export const deleteListaIngredient = async (calendarId, ingredientId) => {
	const response = await apiClient.delete(
		`/calendars/${calendarId}/lista/items/${ingredientId}`
	);
	return response.data;
};

/**
 * Send lista via email
 * @param {number} calendarId - Calendar ID
 * @param {string} email - Optional email address (defaults to user's email)
 * @returns {Promise<Object>} - Response
 */
export const sendListaEmail = async (calendarId, payload) => {
	const response = await apiClient.post(
		`/calendars/${calendarId}/lista/pdf/email`,
		{
			recipient_email: payload?.email,
			lista_ingredients: JSON.stringify(payload?.listaIngredients || []),
		}
	);
	return response.data;
};
