import React from 'react';

/**
 * Recipe Instructions Component
 * Displays step-by-step cooking instructions
 */
export function RecipeInstructions({ instrucciones }) {
	const rawInstructions = Array.isArray(instrucciones) ? instrucciones : [];
	const instructionsArray = rawInstructions.reduce((acc, item) => {
		const text = String(item || '').trim();
		if (!text) return acc;

		// Continuation lines from backend (e.g. "pimienta.") should stay in prior step.
		const isContinuation = /^[a-záéíóúñü(,.;:!?]/.test(text);
		if (isContinuation && acc.length > 0) {
			acc[acc.length - 1] = `${acc[acc.length - 1]} ${text}`.replace(/\s+/g, ' ');
			return acc;
		}

		acc.push(text);
		return acc;
	}, []);

	if (instructionsArray.length === 0) {
		return (
			<div className='recipe-tab-content recipe-instructions'>
				<p style={{ padding: '20px', color: '#7a7a7a' }}>
					No hay instrucciones disponibles para esta receta.
				</p>
			</div>
		);
	}

	return (
		<div className='recipe-tab-content recipe-instructions'>
			{instructionsArray.map((instruccion, index) => (
				<div key={index} className='instruccion'>
					<div className='index'>
						<span>{index + 1}</span>
					</div>
					<p>{String(instruccion).replace('◦', 'º')}</p>
				</div>
			))}
		</div>
	);
}
