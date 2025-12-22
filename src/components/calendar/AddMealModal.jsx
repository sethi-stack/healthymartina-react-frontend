import React, { useState } from 'react';
import './Modal.scss';

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
		<div className='popup popupstyle1 add-meal' onClick={onClose}>
			<div className='container-popup' onClick={(e) => e.stopPropagation()}>
				<button className='close' onClick={onClose}>
					<i className='fas fa-times'></i>
				</button>
				<h3>
					Agregar <span className='add-meal-title'>{mealName}</span>
				</h3>
				<p>Funcionalidad de agregar receta - En desarrollo</p>
				<button onClick={onClose}>Cerrar</button>
			</div>
		</div>
	);
}

