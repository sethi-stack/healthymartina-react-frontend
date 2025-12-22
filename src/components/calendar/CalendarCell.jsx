import React, { useState } from 'react';
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
}) {
	const [showAddModal, setShowAddModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);

	const handleCellClick = () => {
		if (hasRecipe) {
			setShowUpdateModal(true);
		} else {
			setShowAddModal(true);
		}
	};

	return (
		<>
			<div
				id={cellId}
				className='col-day-td'
				data-daynum={dayNum}
				data-mealnum={mealNum}
				data-mealname={mealName}
				onClick={handleCellClick}
			>
				{hasRecipe ? (
					<div className='calRecipe' draggable='true'>
						{mainRecipeId && (
							<div
								className={`calRecipeMain ${
									mainLeftover ? 'recipeLeftover' : ''
								}`}
							>
								<div className='calRecpImg'>
									{mainRecipe?.imagen && (
										<img src={mainRecipe.imagen} alt={mainRecipe.titulo} />
									)}
								</div>
								<div className='calRecpInfo'>
									<div className='calRecpName'>
										<p>{mainRecipe?.titulo || `Receta ${mainRecipeId}`}</p>
									</div>
									{mainServing && (
										<div className='calRecpServing'>
											{mainServing} porciones
										</div>
									)}
								</div>
							</div>
						)}
						{sideRecipeId && (
							<div
								className={`calRecipeSide ${
									sideLeftover ? 'recipeLeftover' : ''
								}`}
							>
								<div className='calRecpImg'>
									{sideRecipe?.imagen && (
										<img src={sideRecipe.imagen} alt={sideRecipe.titulo} />
									)}
								</div>
								<div className='calRecpInfo'>
									<div className='calRecpName'>
										<p>
											{sideRecipe?.titulo || `Acompañamiento ${sideRecipeId}`}
										</p>
									</div>
									{sideServing && (
										<div className='calRecpServing'>
											{sideServing} porciones
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				) : (
					<div className='calRecpAdd'>+ Agregar</div>
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
					onClose={() => setShowUpdateModal(false)}
				/>
			)}
		</>
	);
}

