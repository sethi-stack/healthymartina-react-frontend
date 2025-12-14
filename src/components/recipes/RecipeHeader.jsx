import React from 'react';
import { CartIcon, ClockIcon } from '../icons';

/**
 * Recipe Header Component
 * Displays recipe title, ingredients count, and time
 */
export function RecipeHeader({ title, time, ingredientsCount }) {
	return (
		<div className='indicador'>
			<div className='right'>
				<h3>{title}</h3>
			</div>
			<div className='left'>
				<div className='info'>
					<i>
						<CartIcon />
					</i>
					<p>
						{ingredientsCount}{' '}
						{ingredientsCount === 1 ? 'ingrediente' : 'ingredientes'}
					</p>
				</div>
				<div className='info time-tooltip'>
					<i>
						<ClockIcon />
					</i>
					<a>
						<p>{time} min</p>
					</a>
				</div>
			</div>
		</div>
	);
}
