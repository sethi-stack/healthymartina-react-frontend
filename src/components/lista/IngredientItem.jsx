import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './IngredientItem.scss';

/**
 * IngredientItem Component
 * Single ingredient row with checkbox and actions
 */
export default function IngredientItem({
	ingredient,
	categoryId,
	isTaken = false,
	onToggle,
	onEdit,
	onDelete,
}) {
	const isManual = ingredient.type === 'manual';
	const ingredientId = ingredient.ingrediente_id || ingredient.id;
	const type = ingredient.type || 'receta';

	const handleToggle = () => {
		if (onToggle) {
			onToggle(ingredientId, categoryId, type);
		}
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		if (onEdit && isManual) {
			onEdit(ingredient);
		}
	};

	const handleDelete = (e) => {
		e.stopPropagation();
		if (onDelete && isManual) {
			onDelete(ingredient);
		}
	};

	// Format quantity and measure
	const getQuantityText = () => {
		const cantidad = ingredient.cantidad;
		const medidaSingular = ingredient.medida || ingredient.unidad_medida || '';
		const medidaPlural = ingredient.medida_plural || medidaSingular;

		if (!cantidad && !medidaSingular) return '';

		if (medidaSingular.toLowerCase() === 'al gusto') {
			return 'al gusto';
		}

		// Use plural form if quantity > 1
		const medida = cantidad > 1 ? medidaPlural : medidaSingular;

		// Format quantity: show decimals only if not a whole number
		const formattedCantidad = cantidad % 1 === 0 ? cantidad : cantidad.toFixed(2);

		return `${formattedCantidad || ''} ${medida}`.trim();
	};

	return (
		<div className={`ingredient-item ${isTaken ? 'taken' : ''}`}>
			<label className='ingredient-checkbox'>
				<input
					type='checkbox'
					checked={isTaken}
					onChange={handleToggle}
					className='checkbox-input'
				/>
				<span className='checkbox'></span>
				{getQuantityText() && (
					<span className='ingredient-quantity'>{getQuantityText()}</span>
				)}
				<span className='ingredient-name'>
					{ingredient.ingrediente || ingredient.nombre}
				</span>
			</label>

			{isManual && (
				<div className='ingredient-actions'>
					<button
						className='edit-btn'
						onClick={handleEdit}
						title='Editar ingrediente'
					>
						<FaEdit />
					</button>
					<button
						className='delete-btn'
						onClick={handleDelete}
						title='Eliminar ingrediente'
					>
						<FaTrash />
					</button>
				</div>
			)}
		</div>
	);
}
