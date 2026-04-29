import { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import Modal from './Modal';
import './MealModal.scss';
import RecipeSearchField from './RecipeSearchField';
import ServingsSlider from './ServingsSlider';
import DaysSelector from './DaysSelector';
import { updateRecipeInCalendar } from '../../lib/api/calendars';
import { getRecipe } from '../../lib/api/recipes';

/**
 * Update Meal Modal
 * Modal for editing existing recipes in calendar with tabs for main/side
 * Based on calendario-planificador.blade.php lines 518-688
 * and general.js lines 1030-1191
 */
export default function UpdateMealModal({
	calendarId,
	dayNum,
	dayKey,
	mealNum,
	mealKey,
	mealName,
	mainRecipeId,
	sideRecipeId,
	mainServing,
	sideServing,
	mainLeftover,
	sideLeftover,
	mainSchedule,
	sidesSchedule,
	dayLabels,
	mealLabels,
	onClose,
}) {
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState('main');
	const [selectedMealKey, setSelectedMealKey] = useState(mealKey); // tracks Tiempos selection

	// Main recipe state
	const [mainRecipe, setMainRecipe] = useState(null);
	const [mainServings, setMainServings] = useState(mainServing || 2);
	const [mainIsLeftover, setMainIsLeftover] = useState(mainLeftover || false);
	const [mainSelectedDays, setMainSelectedDays] = useState([dayKey]);
	const [showMainSearch, setShowMainSearch] = useState(false);

	// Side recipe state
	const [sideRecipe, setSideRecipe] = useState(null);
	const [sideServings, setSideServings] = useState(sideServing || 2);
	const [sideIsLeftover, setSideIsLeftover] = useState(sideLeftover || false);
	const [sideSelectedDays, setSideSelectedDays] = useState([dayKey]);
	const [showSideSearch, setShowSideSearch] = useState(false);

	// Fetch main recipe if ID exists
	const { data: mainRecipeData } = useQuery({
		queryKey: ['recipe', 'id', mainRecipeId],
		queryFn: () => getRecipe(mainRecipeId),
		enabled: !!mainRecipeId,
		staleTime: 10 * 60 * 1000,
		refetchOnMount: false,
	});

	// Fetch side recipe if ID exists
	const { data: sideRecipeData } = useQuery({
		queryKey: ['recipe', 'id', sideRecipeId],
		queryFn: () => getRecipe(sideRecipeId),
		enabled: !!sideRecipeId,
		staleTime: 10 * 60 * 1000,
		refetchOnMount: false,
	});

	// Set initial recipe data when fetched
	useEffect(() => {
		if (mainRecipeData?.data) {
			setMainRecipe(mainRecipeData.data);
		}
	}, [mainRecipeData]);

	useEffect(() => {
		if (sideRecipeData?.data) {
			setSideRecipe(sideRecipeData.data);
		}
	}, [sideRecipeData]);

	// In update mode, preselect all days where the same main recipe is currently assigned
	// for the selected meal. This allows unchecking days to remove that assignment.
	useEffect(() => {
		if (!mainRecipe?.id) return;
		const assignedDays = Object.entries(mainSchedule || {})
			.filter(([, meals]) => meals?.[selectedMealKey] === mainRecipe.id)
			.map(([dayKeyFromSchedule]) => dayKeyFromSchedule);
		setMainSelectedDays(
			assignedDays.length > 0 ? assignedDays : [dayKey]
		);
	}, [mainRecipe?.id, mainSchedule, selectedMealKey, dayKey]);

	// In update mode, preselect all days where the same side recipe is currently assigned
	// for the selected meal. This allows unchecking days to remove that assignment.
	useEffect(() => {
		if (!sideRecipe?.id) return;
		const assignedDays = Object.entries(sidesSchedule || {})
			.filter(([, meals]) => meals?.[selectedMealKey] === sideRecipe.id)
			.map(([dayKeyFromSchedule]) => dayKeyFromSchedule);
		setSideSelectedDays(
			assignedDays.length > 0 ? assignedDays : [dayKey]
		);
	}, [sideRecipe?.id, sidesSchedule, selectedMealKey, dayKey]);

	// Update mutation
	const updateRecipeMutation = useMutation({
		mutationFn: (data) => updateRecipeInCalendar(calendarId, data),
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
			queryClient.invalidateQueries({
				queryKey: ['calendar-nutrition', calendarId],
			});
			onClose();
		},
		onError: (error) => {
			console.error('Error updating recipe:', error);
			alert('Error al actualizar la receta. Por favor intente de nuevo.');
		},
	});

	// Handle main recipe selection
	const handleMainRecipeSelect = (recipe) => {
		setMainRecipe(recipe);
		setShowMainSearch(false);
	};

	// Handle side recipe selection
	const handleSideRecipeSelect = (recipe) => {
		setSideRecipe(recipe);
		setShowSideSearch(false);
	};

	// Handle recipe deselection (for showing delete button on update)
	const handleMainRecipeDeselect = () => {
		// Show confirmation for deletion
		if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
			// TODO: Implement recipe deletion
			setMainRecipe(null);
			setShowMainSearch(true);
		}
	};

	const handleSideRecipeDeselect = () => {
		if (window.confirm('¿Estás seguro de que quieres eliminar esta receta complementaria?')) {
			// TODO: Implement side recipe deletion
			setSideRecipe(null);
			setShowSideSearch(true);
		}
	};

	// Handle form submission
	const handleSubmit = (e, mealType) => {
		e.preventDefault();

		const recipe = mealType === 'main' ? mainRecipe : sideRecipe;
		const servings = mealType === 'main' ? mainServings : sideServings;
		const leftover = mealType === 'main' ? mainIsLeftover : sideIsLeftover;
		const selectedDays = mealType === 'main' ? mainSelectedDays : sideSelectedDays;

		if (!recipe || selectedDays.length === 0) {
			alert('Por favor seleccione una receta y al menos un día.');
			return;
		}

		// Format data according to existing API
		const data = {
			recetaid: recipe.id,
			mealtype: mealType,
			mealnum: selectedMealKey,
			daynum: selectedDays,
			update_day: dayKey,
			porciones: servings,
			leftover: leftover ? 1 : 0,
		};

		updateRecipeMutation.mutate(data);
	};

	// Check if submit should be disabled for each tab
	const isMainSubmitDisabled = !mainRecipe || mainSelectedDays.length === 0 || updateRecipeMutation.isPending;

	const isSideSubmitDisabled = !sideRecipe || sideSelectedDays.length === 0 || updateRecipeMutation.isPending;

	const submitButtonText = updateRecipeMutation.isPending ? 'Espere por favor...' : `Editar ${mealName}`;

	return (
		<Modal onClose={onClose} title={`Editar ${mealName}`} className='popupstyle1 update-meal' dataModal='update-meal' width={720}>
			<div className='tabs-container'>
				{/* Tab Navigation */}
				<div className='tabs typ2'>
					<a href='#tabindex1' className={`tabmealmain ${activeTab === 'main' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('main'); }}>
						<p>Principal</p>
					</a>
					<a href='#tabindex2' className={`tabmealside ${activeTab === 'side' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('side'); }}>
						<p>Complemento</p>
					</a>
				</div>

				{/* Tab Content */}
				<div className='tabs-content'>
					{/* Main Recipe Tab */}
					{activeTab === 'main' && (
						<div className='tab-pane active' id='tabindex1'>
							<form className='update-meal-form meal-main' onSubmit={(e) => handleSubmit(e, 'main')} data-action='/api/calendario/{id}/update-recipe'>
								<input type='radio' name='mealnum' className='recpmealnum' value={selectedMealKey} checked readOnly style={{ display: 'none' }} />
								<input type='radio' name='mealtype' className='mealtype' value='main' checked readOnly style={{ display: 'none' }} />
								<input type='hidden' name='calenderio_id' value={calendarId} />
								<input type='hidden' name='update_day' value={dayKey} />

								{/* Recipe Search (shown when changing recipe) */}
								{showMainSearch && <RecipeSearchField onSelect={handleMainRecipeSelect} placeholder='Buscar receta...' />}

								{/* Selected Recipe Display */}
								{mainRecipe && (
									<div className='afterSelReceta' style={{ display: 'block' }} data-daynum={dayNum} data-mealnum={mealNum}>
										<div className='form-group'>
											<p>Receta</p>
											<div className='receta-field'>
												<FaCheck className='fas fa-check' />
												<div>{mainRecipe.titulo}</div>
												<span onClick={handleMainRecipeDeselect}>
													X
												</span>
												<input type='hidden' name='recetaid' className='recetaid' value={mainRecipe.id} />
											</div>
											<a href={`/receta/${mainRecipe.slug}?ser=${mainServings}`} className='recetalink' target='_blank' rel='noopener noreferrer'>
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
																	// Update days selector when meal time changes
																	setMainSelectedDays([dayKey]);
																}}
															/>
															<span className={`radiolabel label-mealname${key === selectedMealKey ? ' selected' : ''}`}>{label}</span>
														</label>
													);
												})}
											</div>
										</div>

										{/* Servings Slider */}
										<ServingsSlider value={mainServings} onChange={setMainServings} isLeftover={mainIsLeftover} onLeftoverChange={setMainIsLeftover} recipe={mainRecipe} />

										{/* Days Selection */}
										<DaysSelector
											selectedRecipeId={mainRecipe.id}
											mealType='main'
											mealNum={parseInt(selectedMealKey.split('_')[1])}
											mainSchedule={mainSchedule}
											sidesSchedule={sidesSchedule}
											selectedDays={mainSelectedDays}
											onChange={setMainSelectedDays}
											dayLabels={dayLabels}
											isUpdateMode={true}
										/>

										{/* Submit Button */}
										<button type='submit' className={`hm-btn hm-btn--primary hm-btn--block hm-mt--md add-meal-btn ${isMainSubmitDisabled ? 'add-meal-btn-disabled' : ''}`} disabled={isMainSubmitDisabled}>
											{submitButtonText}
										</button>
									</div>
								)}
							</form>
						</div>
					)}

					{/* Side Recipe Tab */}
					{activeTab === 'side' && (
						<div className='tab-pane active' id='tabindex2'>
							<form className='update-meal-form meal-side' onSubmit={(e) => handleSubmit(e, 'side')} data-action='/api/calendario/{id}/update-recipe'>
								<input type='radio' name='mealnum' className='recpmealnum' value={selectedMealKey} checked readOnly style={{ display: 'none' }} />
								<input type='radio' name='mealtype' className='mealtype' value='side' checked readOnly style={{ display: 'none' }} />
								<input type='hidden' name='calenderio_id' value={calendarId} />
								<input type='hidden' name='update_day' value={dayKey} />

								{/* Recipe Search */}
								{(showSideSearch || !sideRecipe) && <RecipeSearchField onSelect={handleSideRecipeSelect} placeholder='Buscar receta complementaria...' />}

								{/* Selected Recipe Display */}
								{sideRecipe ? (
									<div className='afterSelReceta' style={{ display: 'block' }} data-daynum={dayNum} data-mealnum={mealNum}>
										<div className='form-group'>
											<p>Receta</p>
											<div className='receta-field'>
												<FaCheck className='fas fa-check' />
												<div>{sideRecipe.titulo}</div>
												<span onClick={handleSideRecipeDeselect}>
													X
												</span>
												<input type='hidden' name='recetaid' className='recetaid' value={sideRecipe.id} />
											</div>
											<a href={`/receta/${sideRecipe.slug}?ser=${sideServings}`} className='recetalink' target='_blank' rel='noopener noreferrer'>
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
																	// Update days selector when meal time changes
																	setSideSelectedDays([dayKey]);
																}}
															/>
															<span className={`radiolabel label-mealname${key === selectedMealKey ? ' selected' : ''}`}>{label}</span>
														</label>
													);
												})}
											</div>
										</div>

										{/* Servings Slider */}
										<ServingsSlider value={sideServings} onChange={setSideServings} isLeftover={sideIsLeftover} onLeftoverChange={setSideIsLeftover} recipe={sideRecipe} />

										{/* Days Selection */}
										<DaysSelector
											selectedRecipeId={sideRecipe.id}
											mealType='side'
											mealNum={parseInt(selectedMealKey.split('_')[1])}
											mainSchedule={mainSchedule}
											sidesSchedule={sidesSchedule}
											selectedDays={sideSelectedDays}
											onChange={setSideSelectedDays}
											dayLabels={dayLabels}
											isUpdateMode={true}
										/>

										{/* Submit Button */}
										<button type='submit' className={`hm-btn hm-btn--primary hm-btn--block hm-mt--md add-meal-btn ${isSideSubmitDisabled ? 'add-meal-btn-disabled' : ''}`} disabled={isSideSubmitDisabled}>
											{submitButtonText}
										</button>
									</div>
								) : (
									<div className='afterSelReceta' style={{ display: 'block' }}>
										<p className='hm-text--muted'>Selecciona una receta complementaria</p>
										<button type='button' className='hm-btn hm-btn--outline hm-btn--block hm-mt--md' onClick={onClose}>
											Cerrar
										</button>
									</div>
								)}
							</form>
						</div>
					)}
				</div>
			</div>
		</Modal>
	);
}
