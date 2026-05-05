import { create } from 'zustand';

export const useExportProgressStore = create((set) => ({
	active: false,
	progress: 0,
	stage: 'queued',
	stageSequence: [],
	stageHistory: [],
	recipesDone: 0,
	recipesTotal: 0,
	message: '',
	error: null,
	success: false,
	setProgress: (payload) =>
		set((state) => ({
			...state,
			...payload,
			active: true,
			error: null,
			success: false,
		})),
	complete: (message = 'La exportación a concluido con éxito') =>
		set((state) => ({
			...state,
			active: true,
			progress: 100,
			stage: 'completed',
			message,
			success: true,
			error: null,
		})),
	fail: (message = 'Ocurrió algún error') =>
		set((state) => ({
			...state,
			active: true,
			error: message,
			success: false,
		})),
	reset: () =>
		set({
			active: false,
			progress: 0,
			stage: 'queued',
			stageSequence: [],
			stageHistory: [],
			recipesDone: 0,
			recipesTotal: 0,
			message: '',
			error: null,
			success: false,
		}),
}));
