import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import * as profileAPI from '../lib/api/profile';

/**
 * Profile & Preferences hooks using TanStack Query
 */

export const useProfile = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	return useQuery({
		queryKey: ['profile'],
		queryFn: profileAPI.getProfile,
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000,
		select: (data) => data.data ?? data,
	});
};

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();
	const updateUser = useAuthStore((state) => state.updateUser);

	return useMutation({
		mutationFn: profileAPI.updateProfile,
		onSuccess: (data) => {
			const user = data.user ?? data.data ?? data;
			// Wrap in { data: ... } to match the raw cache shape from getProfile (UserResource)
			queryClient.setQueryData(['profile'], { data: user });
			updateUser(user);
		},
	});
};

export const useUpdatePassword = () => {
	return useMutation({
		mutationFn: profileAPI.updatePassword,
	});
};

export const useUploadPhoto = () => {
	const queryClient = useQueryClient();
	const updateUser = useAuthStore((state) => state.updateUser);

	return useMutation({
		mutationFn: profileAPI.uploadPhoto,
		onSuccess: (data) => {
			const user = data.user ?? data.data ?? data;
			queryClient.setQueryData(['profile'], (old) => ({
				data: { ...(old?.data ?? old ?? {}), image: user.image },
			}));
			updateUser({ image: user.image });
		},
	});
};

export const useDeletePhoto = () => {
	const queryClient = useQueryClient();
	const updateUser = useAuthStore((state) => state.updateUser);

	return useMutation({
		mutationFn: profileAPI.deletePhoto,
		onSuccess: () => {
			queryClient.setQueryData(['profile'], (old) => ({
				data: { ...(old?.data ?? old ?? {}), image: null },
			}));
			updateUser({ image: null });
		},
	});
};

export const useUploadBusinessPhoto = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: profileAPI.uploadBusinessPhoto,
		onSuccess: (data) => {
			const user = data.user ?? data.data ?? data;
			queryClient.setQueryData(['profile'], (old) => ({
				data: { ...(old?.data ?? old ?? {}), bimage: user.bimage },
			}));
		},
	});
};

export const useDeleteBusinessPhoto = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: profileAPI.deleteBusinessPhoto,
		onSuccess: () => {
			queryClient.setQueryData(['profile'], (old) => ({
				data: { ...(old?.data ?? old ?? {}), bimage: null },
			}));
		},
	});
};

export const usePreferences = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	return useQuery({
		queryKey: ['preferences'],
		queryFn: profileAPI.getPreferences,
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000,
	});
};

export const useUpdatePreferences = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: profileAPI.updatePreferences,
		onSuccess: (data) => {
			queryClient.setQueryData(['preferences'], (old) => ({
				...old,
				...data,
			}));
		},
	});
};
