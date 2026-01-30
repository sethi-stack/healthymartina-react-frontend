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
		<Modal onClose={onClose} title={`Editar ${mealName}`} className='popupstyle1 update-meal' dataModal='update-meal'>
			<div className='hm-form'>
				<p className='hm-text--muted'>Funcionalidad de editar receta - En desarrollo</p>
				<button className='hm-btn hm-btn--outline hm-btn--block hm-mt--md' onClick={onClose}>
					Cerrar
				</button>
			</div>
		</Modal>
	);
}

