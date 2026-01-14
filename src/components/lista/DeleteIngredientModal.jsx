import React from 'react';
import { FaExclamation } from 'react-icons/fa';
import Modal from '../calendar/Modal';
import '../shared/ModalForms.scss';

/**
 * DeleteIngredientModal Component
 * Confirmation modal for deleting manual ingredients
 */
export default function DeleteIngredientModal({
	ingredient,
	onClose,
	onConfirm,
	isLoading = false,
}) {
	const handleConfirm = () => {
		if (onConfirm) {
			onConfirm();
		}
	};

	return (
		<Modal
			isOpen={true}
			onClose={onClose}
			title='Eliminar Ingrediente'
			width={540}
		>
			<form onSubmit={(e) => e.preventDefault()}>
				<div className='exclamacion'>
					<span>
						<FaExclamation />
					</span>
					<p className='bold'>¿Estás seguro?</p>
					<p>Esta acción no se puede deshacer</p>
					{ingredient && (
						<p className='ingredient-name'>
							Eliminarás: <strong>{ingredient.nombre || ingredient.ingrediente}</strong>
						</p>
					)}
				</div>

				<input
					type='button'
					className='special'
					value={isLoading ? 'Eliminando...' : 'Eliminar Ingrediente'}
					onClick={handleConfirm}
					disabled={isLoading}
				/>
			</form>
		</Modal>
	);
}
