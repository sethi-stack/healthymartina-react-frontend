import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEye, FaUndo, FaTrashAlt } from 'react-icons/fa';
import { EllipsisVerticalIcon, CalendarioIcon } from '../icons';
import { removeRecipeFromCalendar } from '../../lib/api/calendars';
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
	const [mainMenuOpen, setMainMenuOpen] = useState(false);
	const [sideMenuOpen, setSideMenuOpen] = useState(false);
	const mainMenuRef = useRef(null);
	const sideMenuRef = useRef(null);
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
		window.open(`/receta/${recipe.slug}`, '_blank');
		setMainMenuOpen(false);
		setSideMenuOpen(false);
	};

	const handleToggleLeftover = (mealType, e) => {
		e.stopPropagation();
		// TODO: Implement leftover toggle
		console.log('Toggle leftover for', mealType);
		setMainMenuOpen(false);
		setSideMenuOpen(false);
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
		setMainMenuOpen(false);
		setSideMenuOpen(false);
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
							<div
								className={`calRecipeMain hm-calendar__recipe ${
									mainLeftover ? 'recipeLeftover hm-calendar__recipe--leftover' : ''
								}`}
							>
								{/* Recipe Image */}
								<div className='calRecpImg hm-calendar__recipe-image'>
									<div className='recipe-image-background hm-card__image-placeholder'>
										<CalendarioIcon />
									</div>
									{mainRecipe?.imagen && (
										<img
											className='lozad recipe-image-overlay hm-card__image-overlay hm-card__image-overlay--loaded'
											src={getImageUrl(mainRecipe.imagen)}
											alt={mainRecipe.titulo}
											loading='lazy'
										/>
									)}
								</div>

								{/* Recipe Info */}
								<div className='calRecpInfo hm-calendar__recipe-info'>
									<div className='row'>
										<div className='calRecpName hm-calendar__recipe-name'>
											<p>{formatTitle(mainRecipe?.titulo) || `RECETA ${mainRecipeId}`}</p>
										</div>

										{/* Menu Button */}
										<div className='button-hamburger hm-menu hm-menu--dots-only' ref={mainMenuRef}>
											<button
												onClick={(e) => {
													e.stopPropagation();
													setMainMenuOpen(!mainMenuOpen);
												}}
												className={`hm-menu__trigger ${mainMenuOpen ? 'hm-menu__trigger--active active' : ''}`}
											>
												<EllipsisVerticalIcon />
											</button>
											<div className={`sub-menu hm-menu__dropdown ${mainMenuOpen ? 'hm-menu__dropdown--open' : ''}`}>
												<button
													type='button'
													className='hm-menu__item'
													onClick={(e) => handleViewRecipe(mainRecipe, e)}
												>
													<FaEye className='hm-menu__icon' />
													<span>Ver receta</span>
												</button>
												<button
													type='button'
													className='hm-menu__item'
													onClick={(e) => handleToggleLeftover('main', e)}
												>
													<FaUndo className='hm-menu__icon' />
													<span>Recalentado</span>
												</button>
												<button
													type='button'
													className='hm-menu__item'
													onClick={(e) => handleDeleteRecipe('main', e)}
												>
													<FaTrashAlt className='hm-menu__icon' />
													<span>Eliminar</span>
												</button>
											</div>
										</div>
									</div>

									{mainServing && (
										<div className='calRecpServing hm-calendar__recipe-serving'>
											{mainServing} porciones
										</div>
									)}
								</div>
							</div>
						)}
						{sideRecipeId && (
							<div
								className={`calRecipeSide hm-calendar__recipe hm-calendar__recipe--side ${
									sideLeftover ? 'recipeLeftover hm-calendar__recipe--leftover' : ''
								}`}
							>
								{/* Recipe Image */}
								<div className='calRecpImg hm-calendar__recipe-image'>
									<div className='recipe-image-background hm-card__image-placeholder'>
										<CalendarioIcon />
									</div>
									{sideRecipe?.imagen && (
										<img
											className='lozad recipe-image-overlay hm-card__image-overlay hm-card__image-overlay--loaded'
											src={getImageUrl(sideRecipe.imagen)}
											alt={sideRecipe.titulo}
											loading='lazy'
										/>
									)}
								</div>

								{/* Recipe Info */}
								<div className='calRecpInfo hm-calendar__recipe-info'>
									<div className='row'>
										<div className='calRecpName hm-calendar__recipe-name'>
											<p>{formatTitle(sideRecipe?.titulo) || `ACOMPAÑAMIENTO ${sideRecipeId}`}</p>
										</div>

										{/* Menu Button */}
										<div className='button-hamburger hm-menu hm-menu--dots-only' ref={sideMenuRef}>
											<button
												onClick={(e) => {
													e.stopPropagation();
													setSideMenuOpen(!sideMenuOpen);
												}}
												className={`hm-menu__trigger ${sideMenuOpen ? 'hm-menu__trigger--active active' : ''}`}
											>
												<EllipsisVerticalIcon />
											</button>
											<div className={`sub-menu hm-menu__dropdown ${sideMenuOpen ? 'hm-menu__dropdown--open' : ''}`}>
												<button
													type='button'
													className='hm-menu__item'
													onClick={(e) => handleViewRecipe(sideRecipe, e)}
												>
													<FaEye className='hm-menu__icon' />
													<span>Ver receta</span>
												</button>
												<button
													type='button'
													className='hm-menu__item'
													onClick={(e) => handleToggleLeftover('side', e)}
												>
													<FaUndo className='hm-menu__icon' />
													<span>Recalentado</span>
												</button>
												<button
													type='button'
													className='hm-menu__item'
													onClick={(e) => handleDeleteRecipe('side', e)}
												>
													<FaTrashAlt className='hm-menu__icon' />
													<span>Eliminar</span>
												</button>
											</div>
										</div>
									</div>

									{sideServing && (
										<div className='calRecpServing hm-calendar__recipe-serving'>
											{sideServing} porciones
										</div>
									)}
								</div>
							</div>
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

