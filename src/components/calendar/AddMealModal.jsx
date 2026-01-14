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
		<Modal onClose={onClose} title={`Agregar ${mealName}`} className='popupstyle1 add-meal'>
			<p>Funcionalidad de agregar receta - En desarrollo</p>
			<button onClick={onClose}>Cerrar</button>
		</Modal>
	);
}

