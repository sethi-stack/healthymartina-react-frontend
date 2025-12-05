import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store using Zustand
 * Manages authentication state and user data
 * Persists to localStorage for session persistence
 */

export const useAuthStore = create(
	persist(
		(set, get) => ({
			// State
			user: null,
			token: null,
			isAuthenticated: false,

			// Actions
			setAuth: (user, token) => {
				// Store token in localStorage for API client
				if (token) {
					localStorage.setItem('auth_token', token);
					localStorage.setItem('auth_user', JSON.stringify(user));
				}
				set({
					user,
					token,
					isAuthenticated: !!user && !!token,
				});
			},

			clearAuth: () => {
				localStorage.removeItem('auth_token');
				localStorage.removeItem('auth_user');
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				});
			},

			updateUser: (userData) => {
				const currentUser = get().user;
				set({
					user: { ...currentUser, ...userData },
				});
			},
		}),
		{
			name: 'auth-storage', // localStorage key
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);
