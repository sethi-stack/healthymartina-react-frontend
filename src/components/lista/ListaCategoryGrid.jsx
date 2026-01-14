import React from 'react';
import CategoryCard from './CategoryCard';
import './ListaCategoryGrid.scss';

/**
 * ListaCategoryGrid Component
 * Displays ingredient categories in a 3-column grid
 */
export default function ListaCategoryGrid({
	categories = [],
	ingredients = {},
	takenIngredients = [],
	onToggleIngredient,
	onAddIngredient,
	onEditIngredient,
	onDeleteIngredient,
}) {
	if (categories.length === 0) {
		return (
			<div className='no-categories'>
				<p>No hay categorías disponibles.</p>
			</div>
		);
	}

	return (
		<div className='sub-container-list'>
			{categories.map((category, index) => (
				<CategoryCard
					key={category.id}
					category={category}
					ingredients={ingredients[category.id] || []}
					takenIngredients={takenIngredients}
					onToggleIngredient={onToggleIngredient}
					onAddIngredient={onAddIngredient}
					onEditIngredient={onEditIngredient}
					onDeleteIngredient={onDeleteIngredient}
					isLast={(index + 1) % 3 === 0}
				/>
			))}
		</div>
	);
}
