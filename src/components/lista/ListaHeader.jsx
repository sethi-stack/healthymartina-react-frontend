import React from 'react';
import './ListaHeader.scss';

/**
 * ListaHeader Component
 * Displays calendar title and total ingredient count
 */
export default function ListaHeader({ calendar, ingredientCount = 0 }) {
	if (!calendar) {
		return null;
	}

	return (
		<div className='indicador'>
			<div className='left'>
				<h3>{calendar.title}</h3>
			</div>
			<div className='right'>
				<p>
					<img src='/img/iconos/ingredientes.svg' alt='Ingredientes' />
					<span className='total-ingrediente'>
						{ingredientCount} ingrediente{ingredientCount !== 1 ? 's' : ''}
					</span>
				</p>
			</div>
		</div>
	);
}
