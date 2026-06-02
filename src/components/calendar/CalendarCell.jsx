import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEye, FaUndo, FaTrashAlt } from 'react-icons/fa';
import { addRecipeToCalendar, removeRecipeFromCalendar } from '../../lib/api/calendars';
import { RecipeActionMenu } from '../shared/RecipeActionMenu';
import { RecipeCard } from '../recipes/RecipeCard';
import AddMealModal from './AddMealModal';
import { invalidateCalendarNutritionQueries } from './calendarNutritionQueryUtils';
import UpdateMealModal from './UpdateMealModal';
import './CalendarCell.scss';

/**
 * Calendar Cell Component
 * Represents a single cell in the calendar grid (day + meal combination)
 * Note: Recipe details should be passed from parent or fetched separately
 */
export default function CalendarCell({
	cellId,
	dayNum,
	dayKey,
	mealNum,
	mealKey,
	mealName,
	calendarId,
	mainRecipeId,
	sideRecipeId,
	mainServing,
	sideServing,
	mainLeftover,
	sideLeftover,
	mainRacion,
	sideRacion,
	hasRecipe,
	mainRecipe, // Recipe data passed from parent
	sideRecipe, // Recipe data passed from parent
	dayLabels,
	mealLabels,
	mainSchedule,
	sidesSchedule,
	readOnly = false,
}) {
	const [showAddModal, setShowAddModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [updateModalTab, setUpdateModalTab] = useState('main');
	const [isDragHover, setIsDragHover] = useState(false);
	const dragPreviewRef = useRef(null);
	const queryClient = useQueryClient();

	useEffect(
		() => () => {
			if (dragPreviewRef.current?.parentNode) {
				dragPreviewRef.current.parentNode.removeChild(dragPreviewRef.current);
			}
			dragPreviewRef.current = null;
		},
		[]
	);

	// Get image base URL from environment variable
	const imageBaseUrl =
		import.meta.env.VITE_IMAGE_BASE_URL ||
		'https://storage.googleapis.com/hmartina.appspot.com/';

	// Construct full image URL (reused from RecipeCard)
	const getImageUrl = (imagePath) => {
		if (!imagePath) return null;
		// If already a full URL, return as is
		if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
			return imagePath;
		}
		// Otherwise, prepend base URL
		const baseUrl = imageBaseUrl.endsWith('/')
			? imageBaseUrl
			: `${imageBaseUrl}/`;
		const path = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
		return `${baseUrl}${path}`;
	};

	// Close menus when clicking outside
	// The RecipeActionMenu component now handles its own open/close state internally.
	// This useEffect is no longer needed for managing external menu state.
	// Keeping it commented out for now in case of future need for global click handling.
	/*
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				mainMenuRef.current &&
				!mainMenuRef.current.contains(event.target) &&
				mainMenuOpen
			) {
				setMainMenuOpen(false);
			}
			if (
				sideMenuRef.current &&
				!sideMenuRef.current.contains(event.target) &&
				sideMenuOpen
			) {
				setSideMenuOpen(false);
			}
		};

		if (mainMenuOpen || sideMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [mainMenuOpen, sideMenuOpen]);
	*/

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: (data) => removeRecipeFromCalendar(calendarId, data),
		onSuccess: (response) => {
			const updatedCalendar =
				response?.calendar?.data || response?.calendar || null;
			if (updatedCalendar) {
				queryClient.setQueryData(['calendar', calendarId], {
					data: updatedCalendar,
				});
			} else {
				queryClient.invalidateQueries({ queryKey: ['calendar', calendarId] });
			}
			invalidateCalendarNutritionQueries(queryClient, calendarId);
		},
		onError: (error) => {
			console.error('Error removing recipe:', error);
			alert('Error al eliminar la receta. Por favor intente de nuevo.');
		},
	});

	const moveRecipeMutation = useMutation({
		mutationFn: async (payload) => {
			await addRecipeToCalendar(calendarId, {
				recetaid: payload.recipeId,
				mealtype: payload.mealType,
				mealnum: mealKey,
				daynum: [dayKey],
				porciones: payload.servings || 1,
				leftover: payload.leftover ? 1 : 0,
			});

			// If source cell also had a side recipe, move it together with the main.
			if (payload.sideRecipeId) {
				await addRecipeToCalendar(calendarId, {
					recetaid: payload.sideRecipeId,
					mealtype: 'side',
					mealnum: mealKey,
					daynum: [dayKey],
					porciones: payload.sideServings || 1,
					leftover: payload.sideLeftover ? 1 : 0,
				});
			}

			return removeRecipeFromCalendar(calendarId, {
				daynum: payload.fromDayKey,
				mealnum: payload.fromMealKey,
				mealtype: payload.mealType,
			});
		},
		onSuccess: (response) => {
			const updatedCalendar =
				response?.calendar?.data || response?.calendar || null;
			if (updatedCalendar) {
				queryClient.setQueryData(['calendar', calendarId], {
					data: updatedCalendar,
				});
			} else {
				queryClient.invalidateQueries({ queryKey: ['calendar', calendarId] });
			}
			invalidateCalendarNutritionQueries(queryClient, calendarId);
		},
		onError: (error) => {
			console.error('Error moving recipe:', error);
			alert('Error al mover la receta. Por favor intente de nuevo.');
		},
	});

	const toggleLeftoverMutation = useMutation({
		mutationFn: (payload) =>
			addRecipeToCalendar(calendarId, {
				recetaid: payload.recipeId,
				mealtype: payload.mealType,
				mealnum: mealKey,
				daynum: [dayKey],
				porciones: payload.servings || 1,
				leftover: payload.leftover ? 1 : 0,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['calendar', calendarId] });
			invalidateCalendarNutritionQueries(queryClient, calendarId);
		},
		onError: (error) => {
			console.error('Error updating leftover state:', error);
			alert('Error al actualizar recalentado. Por favor intente de nuevo.');
		},
	});

	const handleCellClick = () => {
		if (readOnly) return;
		if (hasRecipe) {
			setUpdateModalTab('main');
			setShowUpdateModal(true);
		} else {
			setShowAddModal(true);
		}
	};

	const handleViewRecipe = (recipe, e) => {
		e.stopPropagation();
		if (!recipe) return;
		const detailUrl = recipe.slug
			? `/receta/${recipe.slug}`
			: recipe.id
				? `/receta-id/${recipe.id}`
				: null;
		if (!detailUrl) return;
		window.open(detailUrl, '_blank');
	};

	const handleToggleLeftover = (mealType, e) => {
		if (readOnly) return;
		e.stopPropagation();
		const isMainMeal = mealType === 'main';
		const recipeId = isMainMeal ? mainRecipeId : sideRecipeId;
		const currentLeftover = isMainMeal ? mainLeftover : sideLeftover;
		const servings = isMainMeal ? mainServing : sideServing;

		if (!recipeId) {
			return;
		}

		toggleLeftoverMutation.mutate({
			recipeId,
			mealType,
			servings: servings || 1,
			leftover: !currentLeftover,
		});
	};

	const handleDeleteRecipe = (mealType, e) => {
		if (readOnly) return;
		e.stopPropagation();
		if (confirm('¿Está seguro de que desea eliminar esta receta del calendario?')) {
			deleteMutation.mutate({
				daynum: dayKey,
				mealnum: mealKey,
				mealtype: mealType,
			});
		}
	};

	const formatTitle = (title) => {
		if (!title) return '';
		return title.toUpperCase();
	};

	const handleDragStart = (e) => {
		if (readOnly) return;
		if (!mainRecipeId) return;
		const payload = {
			calendarId,
			recipeId: mainRecipeId,
			mealType: 'main',
			fromDayKey: dayKey,
			fromMealKey: mealKey,
			servings: mainServing || 1,
			leftover: !!mainLeftover,
			sideRecipeId: sideRecipeId || null,
			sideServings: sideServing || 1,
			sideLeftover: !!sideLeftover,
		};
		e.dataTransfer.setData('application/json', JSON.stringify(payload));
		e.dataTransfer.effectAllowed = 'move';

		// Clean previous preview (if any) before creating a new one.
		if (dragPreviewRef.current?.parentNode) {
			dragPreviewRef.current.parentNode.removeChild(dragPreviewRef.current);
		}

		const dragPreview = document.createElement('div');
		dragPreview.className = 'hm-calendar__drag-preview';
		dragPreview.textContent = formatTitle(mainRecipe?.titulo || `RECETA ${mainRecipeId}`);
		document.body.appendChild(dragPreview);
		dragPreviewRef.current = dragPreview;
		e.dataTransfer.setDragImage(dragPreview, 12, 12);
	};

	const handleDragEnd = () => {
		setIsDragHover(false);
		if (dragPreviewRef.current?.parentNode) {
			dragPreviewRef.current.parentNode.removeChild(dragPreviewRef.current);
		}
		dragPreviewRef.current = null;
	};

	const handleDragOver = (e) => {
		if (readOnly) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		setIsDragHover(true);
	};

	const handleDragLeave = () => {
		if (readOnly) return;
		setIsDragHover(false);
	};

	const handleDrop = (e) => {
		if (readOnly) return;
		e.preventDefault();
		e.stopPropagation();
		setIsDragHover(false);
		const raw = e.dataTransfer.getData('application/json');
		if (!raw) return;

		let payload = null;
		try {
			payload = JSON.parse(raw);
		} catch (_err) {
			return;
		}
		if (!payload?.recipeId) return;
		if (payload.calendarId !== calendarId) return;
		if (payload.fromDayKey === dayKey && payload.fromMealKey === mealKey) return;

		moveRecipeMutation.mutate(payload);
	};

	return (
		<>
			<div
				id={cellId}
				className={`col-day-td hm-calendar__day-col ${
					isDragHover ? 'hm-calendar__day-col--drop-target' : ''
				}`}
				data-daynum={dayNum}
				data-mealnum={mealNum}
				data-mealname={mealName}
				onClick={handleCellClick}
				onDragOver={readOnly ? undefined : handleDragOver}
				onDragLeave={readOnly ? undefined : handleDragLeave}
				onDrop={readOnly ? undefined : handleDrop}
			>
				{hasRecipe ? (
					<div
						className='calRecipe hm-calendar__cell'
						draggable={!readOnly}
						onDragStart={readOnly ? undefined : handleDragStart}
						onDragEnd={readOnly ? undefined : handleDragEnd}
					>
						{mainRecipeId && (
							<RecipeCard
								recipe={
									mainRecipe
										? {
												...mainRecipe,
												titulo: mainRecipe.titulo || `RECETA ${mainRecipeId}`,
											}
										: {
												id: mainRecipeId,
												titulo: `RECETA ${mainRecipeId}`,
											}
								}
								variant='calendar'
								hideLink={true}
								hideMeta={true}
								isLeftover={mainLeftover}
								customClass='calRecipeMain'
								calendarServingCount={mainServing || null}
								calendarRacion={mainRacion || null}
								onClick={(e) => {
									e.stopPropagation();
									if (readOnly) return;
									setUpdateModalTab('main');
									setShowUpdateModal(true);
								}}
								customMenu={
									readOnly ? null : (
										<RecipeActionMenu
											onViewRecipe={(e) =>
												handleViewRecipe(
													mainRecipe || { id: mainRecipeId },
													e
												)
											}
											onToggleLeftover={(e) => handleToggleLeftover('main', e)}
											onDeleteRecipe={(e) => handleDeleteRecipe('main', e)}
											isLeftover={mainLeftover}
											triggerSize='sm'
										/>
									)
								}
							/>
						)}
						{sideRecipeId && (
							<RecipeCard
								recipe={
									sideRecipe
										? {
												...sideRecipe,
												titulo: sideRecipe.titulo || `ACOMPAÑAMIENTO ${sideRecipeId}`,
											}
										: {
												id: sideRecipeId,
												titulo: `ACOMPAÑAMIENTO ${sideRecipeId}`,
											}
								}
								variant='calendar'
								hideLink={true}
								hideMeta={true}
								isLeftover={sideLeftover}
								customClass='calRecipeSide hm-calendar__recipe--side'
								calendarServingCount={sideServing || null}
								calendarRacion={sideRacion || null}
								onClick={(e) => {
									e.stopPropagation();
									if (readOnly) return;
									setUpdateModalTab('side');
									setShowUpdateModal(true);
								}}
								customMenu={
									readOnly ? null : (
										<RecipeActionMenu
											onViewRecipe={(e) =>
												handleViewRecipe(
													sideRecipe || { id: sideRecipeId },
													e
												)
											}
											onToggleLeftover={(e) => handleToggleLeftover('side', e)}
											onDeleteRecipe={(e) => handleDeleteRecipe('side', e)}
											isLeftover={sideLeftover}
											triggerSize='sm'
										/>
									)
								}
							/>
						)}
					</div>
				) : (
					<div className='calRecpAdd hm-calendar__cell-add'>+ Agregar</div>
				)}
			</div>

			{showAddModal && !readOnly && (
				<AddMealModal
					calendarId={calendarId}
					dayNum={dayNum}
					dayKey={dayKey}
					mealNum={mealNum}
					mealKey={mealKey}
					mealName={mealName}
					mainSchedule={mainSchedule}
					sidesSchedule={sidesSchedule}
					dayLabels={dayLabels}
					mealLabels={mealLabels}
					onClose={() => setShowAddModal(false)}
				/>
			)}

			{showUpdateModal && hasRecipe && !readOnly && (
				<UpdateMealModal
					calendarId={calendarId}
					dayNum={dayNum}
					dayKey={dayKey}
					mealNum={mealNum}
					mealKey={mealKey}
					mealName={mealName}
					mainRecipeId={mainRecipeId}
					sideRecipeId={sideRecipeId}
					mainServing={mainServing}
					sideServing={sideServing}
					mainLeftover={mainLeftover}
					sideLeftover={sideLeftover}
					mainRacion={mainRacion}
					sideRacion={sideRacion}
					mainSchedule={mainSchedule}
					sidesSchedule={sidesSchedule}
					dayLabels={dayLabels}
					mealLabels={mealLabels}
					initialTab={updateModalTab}
					onClose={() => setShowUpdateModal(false)}
				/>
			)}
		</>
	);
}
