import React from 'react';
import Modal from './Modal';

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
		<Modal onClose={onClose} title={`Editar ${mealName}`} className='popupstyle1 update-meal'>
			<p>Funcionalidad de editar receta - En desarrollo</p>
			<button onClick={onClose}>Cerrar</button>
		</Modal>
	);
}

