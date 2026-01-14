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
		const medida = ingredient.medida || ingredient.unidad_medida || '';

		if (!cantidad && !medida) return '';

		if (medida.toLowerCase() === 'al gusto') {
			return 'al gusto';
		}

		return `${cantidad || ''} ${medida}`.trim();
	};

	return (
		<div className={`ingredient-item ${isTaken ? 'taken' : ''}`}>
			<label className='ingredient-checkbox ingrediente'>
				<input
					type='checkbox'
					checked={isTaken}
					onChange={handleToggle}
					className='checkbox-input'
				/>
				<span className='checkbox'></span>
				<div className='ingredient-content'>
					<h3 className='ingredient-quantity cantidad'>
						{getQuantityText() && <span>{getQuantityText()}</span>}
					</h3>
					<span className='ingredient-name'>
						{ingredient.ingrediente || ingredient.nombre}
					</span>
				</div>
			</label>

			{isManual && (
				<div className='ingredient-actions button-hamburger'>
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
