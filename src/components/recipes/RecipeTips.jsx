import React from 'react';

/**
 * Recipe Tips Component
 * Displays tips and variations for the recipe
 */
export function RecipeTips({ tips }) {
	// Group tips in pairs (title + description)
	const groupedTips = [];
	for (let i = 0; i < tips.length; i += 2) {
		if (i + 1 < tips.length) {
			groupedTips.push({
				title: tips[i],
				description: tips[i + 1],
			});
		}
	}

	return (
		<div className='slide'>
			{groupedTips.map((tip, index) => (
				<div key={index} className='tip'>
					<p>
						<b>{tip.title}</b>
						<br />
						<text>{tip.description}</text>
					</p>
				</div>
			))}
		</div>
	);
}
