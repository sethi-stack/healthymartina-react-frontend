import React from 'react';
import { FaPlus } from 'react-icons/fa';
import IngredientItem from './IngredientItem';
import './CategoryCard.scss';

/**
 * CategoryCard Component
 * Displays a single ingredient category with its ingredients
 */
export default function CategoryCard({
	category,
	ingredients = [],
	takenIngredients = [],
	onToggleIngredient,
	onAddIngredient,
	onEditIngredient,
	onDeleteIngredient,
	isLast = false,
}) {
	const handleAddClick = () => {
		if (onAddIngredient) {
			onAddIngredient(category.id);
		}
	};

	// Check if ingredient is taken
	const isIngredientTaken = (ingredientId, type) => {
		return takenIngredients.some(
			(taken) =>
				taken.ingrediente_id === ingredientId &&
				taken.categoria_id === category.id &&
				taken.ingrediente_type === type
		);
	};

	return (
		<div className={`col13 datos ${isLast ? 'last' : ''}`}>
			<div className='title'>
				<p>{category.nombre ? category.nombre.toUpperCase() : ''}</p>
			</div>

			<div className='lista-calendrio list' data-id={category.id}>
				{ingredients.length === 0 ? (
					<div className='no-ingredients'>
						<p>Sin ingredientes</p>
					</div>
				) : (
					<div className='ingredient-list'>
						{ingredients.map((ingredient, index) => (
							<IngredientItem
								key={`${ingredient.ingrediente_id || ingredient.id}-${index}`}
								ingredient={ingredient}
								categoryId={category.id}
								isTaken={isIngredientTaken(
									ingredient.ingrediente_id || ingredient.id,
									ingredient.type || 'receta'
								)}
								onToggle={onToggleIngredient}
								onEdit={onEditIngredient}
								onDelete={onDeleteIngredient}
							/>
						))}
					</div>
				)}
			</div>

			<button className='add' onClick={handleAddClick}>
				<FaPlus /> Agregar ingrediente
			</button>
		</div>
	);
}
