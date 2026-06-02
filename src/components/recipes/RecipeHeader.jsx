import React from 'react';
import { FaShoppingCart, FaClock, FaPlus } from 'react-icons/fa';

/**
 * Recipe Header Component
 * Displays recipe title, ingredients count, and time
 */
export function RecipeHeader({ title, time, ingredientsCount, timeNote }) {
	const timeNotes = String(timeNote || '')
		.split('+')
		.map((note) => note.trim())
		.filter(Boolean);

	return (
		<div className='indicador'>
			<div className='right'>
				<h3>{title}</h3>
			</div>
			<div className='left'>
				<div className='info'>
					<i>
						<FaShoppingCart />
					</i>
					<p>
						{ingredientsCount}{' '}
						{ingredientsCount === 1 ? 'ingrediente' : 'ingredientes'}
					</p>
				</div>
				<div className='info time-tooltip'>
					<i>
						<FaClock />
					</i>
					<a>
						<p>{time} min</p>
					</a>
					{timeNotes.length ? (
						<button
							type='button'
							className='time-tooltip__trigger'
							aria-label='Ver nota de tiempo'
						>
							<FaPlus />
							<div className='modal-tooltip'>
								{timeNotes.map((note, index) => (
									<p key={`${note}-${index}`}>+ {note}</p>
								))}
							</div>
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
}
