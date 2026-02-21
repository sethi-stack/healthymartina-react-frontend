import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Calendar Store using Zustand
 * Manages selected calendar state across the application
 * Persists to localStorage for session persistence
 */

export const useCalendarStore = create(
	persist(
		(set, get) => ({
			// State
			selectedCalendarId: null,
			selectedCalendarTitle: null,

			// Actions
			setSelectedCalendar: (id, title = '') => {
				set({
					selectedCalendarId: id,
					selectedCalendarTitle: title,
				});
			},

			clearSelectedCalendar: () => {
				set({
					selectedCalendarId: null,
					selectedCalendarTitle: null,
				});
			},

			getSelectedCalendarId: () => get().selectedCalendarId,
		}),
		{
			name: 'calendar-storage', // localStorage key
			partialize: (state) => ({
				selectedCalendarId: state.selectedCalendarId,
				selectedCalendarTitle: state.selectedCalendarTitle,
			}),
		}
	)
);
