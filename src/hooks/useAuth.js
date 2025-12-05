import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import * as authAPI from '../lib/api/auth';

/**
 * Auth Hooks using TanStack Query
 * Provides hooks for authentication operations
 */

/**
 * Hook for user login
 * @returns {Object} Mutation object with login function and state
 */
export const useLogin = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const setAuth = useAuthStore((state) => state.setAuth);

	return useMutation({
		mutationFn: authAPI.login,
		onSuccess: (data) => {
			// Update auth store
			setAuth(data.user, data.token);

			// Invalidate and refetch user queries
			queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });

			// Navigate to dashboard
			navigate('/dashboard');
		},
		onError: (error) => {
			// Error handling is done by the component
			console.error('Login error:', error);
		},
	});
};

/**
 * Hook for user registration
 * @returns {Object} Mutation object with register function and state
 */
export const useRegister = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const setAuth = useAuthStore((state) => state.setAuth);

	return useMutation({
		mutationFn: authAPI.register,
		onSuccess: (data) => {
			// Update auth store
			setAuth(data.user, data.token);

			// Invalidate and refetch user queries
			queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });

			// Navigate to dashboard
			navigate('/dashboard');
		},
		onError: (error) => {
			// Error handling is done by the component
			console.error('Registration error:', error);
		},
	});
};

/**
 * Hook for user logout
 * @returns {Object} Mutation object with logout function and state
 */
export const useLogout = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const clearAuth = useAuthStore((state) => state.clearAuth);

	return useMutation({
		mutationFn: authAPI.logout,
		onSuccess: () => {
			// Clear auth store
			clearAuth();

			// Clear all queries
			queryClient.clear();

			// Navigate to login
			navigate('/login');
		},
		onError: (error) => {
			// Even if API call fails, clear local auth
			clearAuth();
			queryClient.clear();
			navigate('/login');
			console.error('Logout error:', error);
		},
	});
};

/**
 * Hook to get current authenticated user
 * @returns {Object} Query object with user data and state
 */
export const useCurrentUser = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const token = useAuthStore((state) => state.token);

	return useQuery({
		queryKey: ['auth', 'user'],
		queryFn: authAPI.getCurrentUser,
		enabled: isAuthenticated && !!token,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 1,
	});
};

/**
 * Hook for forgot password
 * @returns {Object} Mutation object with forgotPassword function and state
 */
export const useForgotPassword = () => {
	return useMutation({
		mutationFn: authAPI.forgotPassword,
		onError: (error) => {
			console.error('Forgot password error:', error);
		},
	});
};
