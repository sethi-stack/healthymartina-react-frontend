import React, { useEffect, useState } from 'react';
import { FaFileExport } from 'react-icons/fa';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCalendar, getCalendars } from '../../lib/api/calendars';
import { exportRecipePdf } from '../../lib/api/recipes';
import { useCalendarStore } from '../../stores/calendarStore';
import AddMealModal from '../calendar/AddMealModal';
import CalendarPickerModal from '../calendar/CalendarPickerModal';

/**
 * Recipe Actions Component
 * Displays action buttons (Add to Calendar, Export, etc.)
 */
export function RecipeActions({ recipeId, recipeTitle }) {
	const [showAddModal, setShowAddModal] = useState(false);
	const [showCalendarPicker, setShowCalendarPicker] = useState(false);
	const [targetCalendarId, setTargetCalendarId] = useState(null);
	const selectedCalendarIdFromStore = useCalendarStore(
		(state) => state.selectedCalendarId
	);
	const setSelectedCalendar = useCalendarStore((state) => state.setSelectedCalendar);
	const [exportProgress, setExportProgress] = useState({
		progress: 0,
		rendered: 0,
		total: 0,
	});

	const { data: calendarsData } = useQuery({
		queryKey: ['calendars'],
		queryFn: () => getCalendars(),
		staleTime: 5 * 60 * 1000,
	});

	const calendars = calendarsData?.data || [];
	const hasStoredCalendarInList = calendars.some(
		(calendar) => calendar.id === selectedCalendarIdFromStore
	);
	const activeCalendarId = hasStoredCalendarInList
		? selectedCalendarIdFromStore
		: calendars?.[0]?.id || null;

	useEffect(() => {
		if (!activeCalendarId) return;
		if (selectedCalendarIdFromStore !== activeCalendarId) {
			const activeCalendar = calendars.find((c) => c.id === activeCalendarId);
			setSelectedCalendar(activeCalendarId, activeCalendar?.title || '');
		}
	}, [
		activeCalendarId,
		selectedCalendarIdFromStore,
		calendars,
		setSelectedCalendar,
	]);

	const { data: activeCalendarData } = useQuery({
		queryKey: ['calendar', activeCalendarId],
		queryFn: () => getCalendar(activeCalendarId),
		enabled: !!activeCalendarId,
		staleTime: 60 * 1000,
	});

	const { data: targetCalendarData } = useQuery({
		queryKey: ['calendar', targetCalendarId],
		queryFn: () => getCalendar(targetCalendarId),
		enabled: !!targetCalendarId,
		staleTime: 60 * 1000,
	});

	const exportMutation = useMutation({
		mutationFn: () =>
			exportRecipePdf(recipeId, {
				calendarId: activeCalendarId || undefined,
				onProgress: (statusResponse) => {
					setExportProgress({
						progress: Number(statusResponse?.progress || 0),
						rendered: Number(statusResponse?.counters?.rendered_recipe_pages || 0),
						total: Number(statusResponse?.counters?.total_recipe_pages || 0),
					});
				},
			}),
		onSuccess: (blob) => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${recipeTitle || 'receta'}.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
			setExportProgress({ progress: 100, rendered: 0, total: 0 });
		},
		onError: () => {
			alert('No se pudo exportar la receta. Intenta de nuevo.');
			setExportProgress({ progress: 0, rendered: 0, total: 0 });
		},
	});

	const handleAddToCalendar = () => {
		if (!activeCalendarId) {
			alert('No hay calendarios disponibles. Crea uno primero.');
			return;
		}
		setShowCalendarPicker(true);
	};

	const handleExport = () => {
		setExportProgress({ progress: 0, rendered: 0, total: 0 });
		exportMutation.mutate();
	};

	const renderExportLabel = () => {
		if (!exportMutation.isPending) return 'Exportar';
		const percent = Math.max(0, Math.min(99, Number(exportProgress.progress || 0)));
		if (exportProgress.total > 0) {
			return `Exportando ${percent}% (${Math.min(
				exportProgress.rendered,
				exportProgress.total
			)}/${exportProgress.total} recetas)`;
		}
		return `Exportando ${percent}%`;
	};

	const parseSchedule = (value) => {
		if (!value) return {};
		if (typeof value === 'string') {
			try {
				return JSON.parse(value);
			} catch (_e) {
				return {};
			}
		}
		return value;
	};
	const calendar = targetCalendarData?.data || targetCalendarData || activeCalendarData?.data || activeCalendarData;
	const labels = parseSchedule(calendar?.labels);
	const mainSchedule = parseSchedule(calendar?.main_schedule);
	const sidesSchedule = parseSchedule(calendar?.sides_schedule);
	const dayLabels = labels.days || {
		day_1: 'Lunes',
		day_2: 'Martes',
		day_3: 'Miércoles',
		day_4: 'Jueves',
		day_5: 'Viernes',
		day_6: 'Sábado',
		day_7: 'Domingo',
	};
	const mealLabels = labels.meals || {
		meal_1: 'Desayuno',
		meal_2: 'Snack AM',
		meal_3: 'Almuerzo',
		meal_4: 'Snack PM',
		meal_5: 'Cena',
	};

	return (
		<div className='botones'>
			<div className='left'>
				<button className='calendario' onClick={handleAddToCalendar}>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.05 23.05'>
						<defs>
							<style>
								{`.cls-1 {
                  fill: #7a7a7a;
                }`}
							</style>
						</defs>
						<title>calendarios</title>
						<g id='Layer_2' data-name='Layer 2'>
							<g id='Contenido-Home'>
								<path
									className='cls-1'
									d='M2.88,3.6V.72a.72.72,0,0,1,1.44,0V3.6a.72.72,0,0,1-1.44,0Zm12.25.72a.72.72,0,0,0,.72-.72V.72a.72.72,0,0,0-1.44,0V3.6A.72.72,0,0,0,15.13,4.32Zm7.92,13a5.77,5.77,0,1,1-5.76-5.77A5.76,5.76,0,0,1,23.05,17.29Zm-1.44,0a4.32,4.32,0,1,0-4.32,4.32A4.32,4.32,0,0,0,21.61,17.29ZM5.76,8.64H2.88v2.88H5.76ZM2.88,15.85H5.76V13H2.88ZM7.2,11.52h2.88V8.64H7.2Zm0,4.33h2.88V13H7.2ZM1.44,17.14V7.2H17.29v2.88h1.44V4.47a1.58,1.58,0,0,0-1.56-1.59h-.6V3.6a1.44,1.44,0,1,1-2.88,0V2.88H5V3.6a1.44,1.44,0,0,1-2.88,0V2.88h-.6A1.58,1.58,0,0,0,0,4.47V17.14a1.58,1.58,0,0,0,1.56,1.59h8.52V17.29H1.56A.14.14,0,0,1,1.44,17.14Zm13-5.62V8.64H11.52v2.88Zm5,5.77H17.29V15.13a.72.72,0,0,0-1.44,0V18a.72.72,0,0,0,.72.72h2.88a.72.72,0,1,0,0-1.44Z'
								/>
							</g>
						</g>
					</svg>
					<p>Agregar a calendario</p>
				</button>
				<button
					type='button'
					className='export_pdf'
					onClick={handleExport}
					disabled={exportMutation.isPending}
					data-page='receta'
					data-recipeid={recipeId}
					data-recipe={recipeTitle}
				>
					<p>{renderExportLabel()}</p>
					<FaFileExport />
				</button>
			</div>
			<div className='right'></div>
			{showCalendarPicker && (
				<CalendarPickerModal
					calendars={calendars}
					initialCalendarId={activeCalendarId}
					onClose={() => setShowCalendarPicker(false)}
					onConfirm={(calendarId) => {
						const selected = calendars.find((calendarItem) => calendarItem.id === calendarId);
						setSelectedCalendar(calendarId, selected?.title || '');
						setTargetCalendarId(calendarId);
						setShowCalendarPicker(false);
						setShowAddModal(true);
					}}
				/>
			)}
			{showAddModal && (targetCalendarId || activeCalendarId) && calendar && (
				<AddMealModal
					calendarId={targetCalendarId || activeCalendarId}
					dayNum={1}
					dayKey={null}
					mealNum={1}
					mealKey='meal_1'
					mealName={mealLabels.meal_1 || 'Desayuno'}
					mainSchedule={mainSchedule}
					sidesSchedule={sidesSchedule}
					dayLabels={dayLabels}
					mealLabels={mealLabels}
					initialRecipe={{ id: recipeId, titulo: recipeTitle }}
					onClose={() => {
						setShowAddModal(false);
						setTargetCalendarId(null);
					}}
				/>
			)}
		</div>
	);
}
