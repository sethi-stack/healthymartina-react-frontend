import { apiClient } from './client';

/**
 * Profile API endpoints
 */

export const getProfile = async () => {
	const response = await apiClient.get('/profile');
	return response.data;
};

export const updateProfile = async (data) => {
	const response = await apiClient.put('/profile', data);
	return response.data;
};

export const updatePassword = async (data) => {
	const response = await apiClient.put('/profile/password', data);
	return response.data;
};

export const uploadPhoto = async (file) => {
	const formData = new FormData();
	formData.append('photo', file);
	const response = await apiClient.post('/profile/photo', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	return response.data;
};

export const deletePhoto = async () => {
	const response = await apiClient.delete('/profile/photo');
	return response.data;
};

export const uploadBusinessPhoto = async (file) => {
	const formData = new FormData();
	formData.append('photo', file);
	const response = await apiClient.post('/profile/business/photo', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	return response.data;
};

export const deleteBusinessPhoto = async () => {
	const response = await apiClient.delete('/profile/business/photo');
	return response.data;
};

export const getPreferences = async () => {
	const response = await apiClient.get('/preferences');
	return response.data;
};

export const updatePreferences = async (data) => {
	const response = await apiClient.put('/preferences', data);
	return response.data;
};
