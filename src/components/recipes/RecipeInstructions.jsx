import React from 'react';

/**
 * Recipe Instructions Component
 * Displays step-by-step cooking instructions
 */
export function RecipeInstructions({ instrucciones }) {
	return (
		<div className='slide'>
			{instrucciones?.map((instruccion, index) => (
				<div key={index} className='instruccion'>
					<div className='index'>
						<span>{index + 1}</span>
					</div>
					<p>{instruccion.replace('◦', 'º')}</p>
				</div>
			))}
		</div>
	);
}
