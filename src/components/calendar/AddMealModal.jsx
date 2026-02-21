import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from './Modal';
import './MealModal.scss';
import RecipeSearchField from './RecipeSearchField';
import ServingsSlider from './ServingsSlider';
import DaysSelector from './DaysSelector';
import { addRecipeToCalendar } from '../../lib/api/calendars';

/**
 * Add Meal Modal
 * Modal for adding recipes to calendar days and meals
 * Based on calendario-planificador.blade.php lines 445-517
 * and general.js lines 782-808, 870-952
 */
export default function AddMealModal({ calendarId, dayNum, dayKey, mealNum, mealKey, mealName, mainSchedule, sidesSchedule, dayLabels, mealLabels, onClose }) {
	const queryClient = useQueryClient();

	// Form state
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [servings, setServings] = useState(2);
	const [isLeftover, setIsLeftover] = useState(false);
	const [selectedDays, setSelectedDays] = useState([dayKey]);
	const [showRecipeList, setShowRecipeList] = useState(true);
	const [selectedMealKey, setSelectedMealKey] = useState(mealKey); // tracks Tiempos selection

	// Mutation for adding recipe
	const addRecipeMutation = useMutation({
		mutationFn: (data) => addRecipeToCalendar(calendarId, data),
		onSuccess: () => {
			// Invalidate and refetch calendar data
			queryClient.invalidateQueries(['calendar', calendarId]);
			queryClient.invalidateQueries(['calendars']);
			onClose();
		},
		onError: (error) => {
			console.error('Error adding recipe:', error);
			alert('Error al agregar la receta. Por favor intente de nuevo.');
		},
	});

	// Handle recipe selection
	const handleRecipeSelect = (recipe) => {
		setSelectedRecipe(recipe);
		setShowRecipeList(false);
	};

	// Handle recipe deselection
	const handleRecipeDeselect = () => {
		setSelectedRecipe(null);
		setShowRecipeList(true);
		setServings(2);
		setIsLeftover(false);
	};

	// Handle leftover toggle (from general.js lines 860-869)
	const handleLeftoverChange = (checked) => {
		setIsLeftover(checked);
		// Leftover disables servings slider
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!selectedRecipe || selectedDays.length === 0) {
			alert('Por favor seleccione una receta y al menos un día.');
			return;
		}

		// Format data according to existing API (from calendario-planificador.blade.php line 449)
		const data = {
			recetaid: selectedRecipe.id,
			mealtype: 'main',
			mealnum: selectedMealKey,
			daynum: selectedDays,
			porciones: servings,
			leftover: isLeftover ? 1 : 0,
		};

		addRecipeMutation.mutate(data);
	};

	// Check if submit should be disabled
	const isSubmitDisabled = !selectedRecipe || selectedDays.length === 0 || addRecipeMutation.isPending;

	const submitButtonText = addRecipeMutation.isPending ? 'Espere por favor...' : `Agregar ${mealName}`;

	return (
		<Modal onClose={onClose} title={`Agregar ${mealName}`} className='popupstyle1 add-meal' dataModal='add-meal' width={720}>
			<form className='hm-form add-meal-form meal-main' onSubmit={handleSubmit} data-action='/api/calendario/{id}/add-recipe'>
				<input type='radio' name='mealtype' className='mealtype' value='main' checked readOnly style={{ display: 'none' }} />

				{/* Recipe Search */}
				{showRecipeList && <RecipeSearchField onSelect={handleRecipeSelect} placeholder='Buscar receta...' />}

				{/* Selected Recipe Display */}
				{selectedRecipe && (
					<div className='afterSelReceta' style={{ display: 'block' }} data-daynum={dayNum} data-mealnum={mealNum}>
						<div className='form-group'>
							<p>Receta</p>
							<div className='receta-field'>
								<FaCheck className='fas fa-check' />
								<div>{selectedRecipe.titulo}</div>
								<span onClick={handleRecipeDeselect}>
									X
								</span>
								<input type='hidden' name='recetaid' className='recetaid' value={selectedRecipe.id} />
							</div>
							<a href={`/receta/${selectedRecipe.slug}?ser=${servings}`} className='recetalink' target='_blank' rel='noopener noreferrer'>
								Ver detalles de receta
							</a>
						</div>

						{/* Meal Time Selection (Radio Buttons) */}
						<div className='form-group'>
							<p>Tiempos</p>
							<div className='display-flex radio-box-sec'>
								{Object.entries(mealLabels).map(([key, label]) => {
									return (
										<label key={key} className='radiobox-label'>
											<input
												className='label-mealnum'
												type='radio'
												name='mealnum'
												data-name={label}
												value={key}
												checked={key === selectedMealKey}
												onChange={() => {
													setSelectedMealKey(key);
													// Reset days when meal time changes
													setSelectedDays([dayKey]);
												}}
											/>
											<span className='radiolabel label-mealname'>{label}</span>
										</label>
									);
								})}
							</div>
						</div>

						{/* Servings Slider */}
						<ServingsSlider value={servings} onChange={setServings} isLeftover={isLeftover} onLeftoverChange={handleLeftoverChange} recipe={selectedRecipe} />

						{/* Days Selection — updates based on selectedMealKey */}
						<DaysSelector
							selectedRecipeId={selectedRecipe.id}
							mealType='main'
							mealNum={parseInt(selectedMealKey.split('_')[1])}
							mainSchedule={mainSchedule}
							sidesSchedule={sidesSchedule}
							selectedDays={selectedDays}
							onChange={setSelectedDays}
							dayLabels={dayLabels}
						/>

						{/* Submit Button */}
						<button type='submit' className={`hm-btn hm-btn--primary hm-btn--block hm-mt--md add-meal-btn ${isSubmitDisabled ? 'add-meal-btn-disabled' : ''}`} disabled={isSubmitDisabled}>
							{submitButtonText}
						</button>
					</div>
				)}
			</form>
		</Modal>
	);
}
