import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEye, FaUndo, FaTrashAlt } from 'react-icons/fa';
import { removeRecipeFromCalendar } from '../../lib/api/calendars';
import { RecipeActionMenu } from '../shared/RecipeActionMenu';
import { RecipeCard } from '../recipes/RecipeCard';
import AddMealModal from './AddMealModal';
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
	hasRecipe,
	mainRecipe, // Recipe data passed from parent
	sideRecipe, // Recipe data passed from parent
	dayLabels,
	mealLabels,
	mainSchedule,
	sidesSchedule,
}) {
	const [showAddModal, setShowAddModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const queryClient = useQueryClient();

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
		onSuccess: () => {
			queryClient.invalidateQueries(['calendar', calendarId]);
			queryClient.invalidateQueries(['calendars']);
		},
		onError: (error) => {
			console.error('Error removing recipe:', error);
			alert('Error al eliminar la receta. Por favor intente de nuevo.');
		},
	});

	const handleCellClick = () => {
		if (hasRecipe) {
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
		e.stopPropagation();
		// TODO: Implement leftover toggle
		console.log('Toggle leftover for', mealType);
	};

	const handleDeleteRecipe = (mealType, e) => {
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

	return (
		<>
			<div
				id={cellId}
				className='col-day-td hm-calendar__day-col'
				data-daynum={dayNum}
				data-mealnum={mealNum}
				data-mealname={mealName}
				onClick={handleCellClick}
			>
				{hasRecipe ? (
					<div className='calRecipe hm-calendar__cell' draggable='true'>
						{mainRecipeId && (
							<RecipeCard
								recipe={mainRecipe || { id: mainRecipeId, titulo: `RECETA ${mainRecipeId}` }}
								variant='calendar'
								hideLink={true}
								hideMeta={true}
								isLeftover={mainLeftover}
								customClass='calRecipeMain'
								customMenu={
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
								}
							>
								{/* {mainServing && (
									<div className='calRecpServing hm-calendar__recipe-serving'>
										{mainServing} porciones
									</div>
								)} */}
							</RecipeCard>
						)}
						{sideRecipeId && (
							<RecipeCard
								recipe={sideRecipe || { id: sideRecipeId, titulo: `ACOMPAÑAMIENTO ${sideRecipeId}` }}
								variant='calendar'
								hideLink={true}
								hideMeta={true}
								isLeftover={sideLeftover}
								customClass='calRecipeSide hm-calendar__recipe--side'
								customMenu={
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
								}
							>
								{/* {sideServing && (
									<div className='calRecpServing hm-calendar__recipe-serving'>
										{sideServing} porciones
									</div>
								)} */}
							</RecipeCard>
						)}
					</div>
				) : (
					<div className='calRecpAdd hm-calendar__cell-add'>+ Agregar</div>
				)}
			</div>

			{showAddModal && (
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

			{showUpdateModal && hasRecipe && (
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
					mainSchedule={mainSchedule}
					sidesSchedule={sidesSchedule}
					dayLabels={dayLabels}
					mealLabels={mealLabels}
					onClose={() => setShowUpdateModal(false)}
				/>
			)}
		</>
	);
}
