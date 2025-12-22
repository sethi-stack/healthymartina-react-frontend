import React from 'react';
import './Modal.scss';

/**
 * Update Meal Modal
 * Placeholder - to be fully implemented with recipe editing
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
	onClose,
}) {
	return (
		<div className='popup popupstyle1 update-meal' onClick={onClose}>
			<div className='container-popup' onClick={(e) => e.stopPropagation()}>
				<button className='close' onClick={onClose}>
					<i className='fas fa-times'></i>
				</button>
				<h3>
					Editar <span className='edit-meal-form'>{mealName}</span>
				</h3>
				<p>Funcionalidad de editar receta - En desarrollo</p>
				<button onClick={onClose}>Cerrar</button>
			</div>
		</div>
	);
}

