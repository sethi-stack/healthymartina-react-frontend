import React from 'react';
import LeftoverToggle from './LeftoverToggle';

/**
 * Servings Slider Component
 * Range slider for portion selection with leftover toggle
 * Based on calendario-planificador.blade.php lines 487-501
 */
export default function ServingsSlider({ value, onChange, isLeftover, onLeftoverChange, recipe, showLeftover = true }) {
	const servingLabel = recipe?.porcion_nombre_plural || 'Porciones';
	const servingSingular = recipe?.porcion_nombre || 'Porción';
	const isDisabled = isLeftover;

	const racionLabel = value === 1 ? 'Ración' : 'Racións';

	return (
		<div className={`form-group rango typ2 porcionRango ${isDisabled ? 'field-disabled' : ''}`}>
			<div className='porcion-racion-row'>
				<div className='porcion-text'>
					<span className='porcion-cantidad porcionNumero'>{value}</span>{' '}
					<span className='porcionTexto' data-nombre={servingSingular} data-nombre_plural={servingLabel}>
						{value === 1 ? servingSingular : servingLabel}
					</span>
					<span className='porcion-separator'>|</span>
					<span className='racionTexto porcion-cantidad porcionNumero'>{value}</span>{' '}
					<span className='racionTexto'>{racionLabel}</span>
				</div>
				{showLeftover && <LeftoverToggle checked={isLeftover} onChange={onLeftoverChange} />}
			</div>
			<input
				className='e-range recpserving'
				type='range'
				name='porciones'
				min='1'
				max='26'
				step='1'
				value={value}
				onChange={(e) => onChange(parseInt(e.target.value))}
				disabled={isDisabled}
			/>
		</div>
	);
}
