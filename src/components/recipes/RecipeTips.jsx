import React from 'react';

/**
 * Recipe Tips Component
 * Displays tips and variations for the recipe
 */
export function RecipeTips({ tips }) {
	// Debug: Log received data
	console.log('RecipeTips - Received tips:', tips);

	// Ensure tips is an array
	const tipsArray = Array.isArray(tips) ? tips : [];

	console.log('RecipeTips - Processed tipsArray:', tipsArray);

	// Group tips in pairs (title + description)
	const groupedTips = [];
	for (let i = 0; i < tipsArray.length; i += 2) {
		if (i + 1 < tipsArray.length) {
			groupedTips.push({
				title: tipsArray[i],
				description: tipsArray[i + 1],
			});
		} else {
			// If odd number, add the last one as title only
			groupedTips.push({
				title: tipsArray[i],
				description: '',
			});
		}
	}

	if (groupedTips.length === 0) {
		return (
			<div className='slide active'>
				<p style={{ padding: '20px', color: '#7a7a7a' }}>
					No hay tips disponibles para esta receta.
				</p>
			</div>
		);
	}

	// Helper to render text that may contain HTML
	const renderText = (text) => {
		if (!text) return '';
		// Check if it contains HTML
		if (text.includes('<a') || text.includes('<') || text.includes('href=')) {
			return <span dangerouslySetInnerHTML={{ __html: text }} />;
		}
		return text;
	};

	return (
		<div className='slide active'>
			{groupedTips.map((tip, index) => (
				<div key={index} className='tip'>
					<p>
						<b>{renderText(tip.title)}</b>
						{tip.description && (
							<>
								<br />
								<span>{renderText(tip.description)}</span>
							</>
						)}
					</p>
				</div>
			))}
		</div>
	);
}
