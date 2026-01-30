import React from 'react';
import Modal from './Modal';

/**
 * Add Meal Modal
 * Placeholder - to be fully implemented with recipe search and selection
 */
export default function AddMealModal({
	calendarId,
	dayNum,
	dayKey,
	mealNum,
	mealKey,
	mealName,
	onClose,
}) {
	return (
		<Modal onClose={onClose} title={`Agregar ${mealName}`} className='popupstyle1 add-meal' dataModal='add-meal'>
			<div className='hm-form'>
				<p className='hm-text--muted'>Funcionalidad de agregar receta - En desarrollo</p>
				<button className='hm-btn hm-btn--outline hm-btn--block hm-mt--md' onClick={onClose}>
					Cerrar
				</button>
			</div>
		</Modal>
	);
}

