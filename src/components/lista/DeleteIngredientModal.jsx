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
			dataModal='delete-ingredient'
		>
			<form onSubmit={(e) => e.preventDefault()} className='hm-form'>
				<div className='exclamacion hm-text--center'>
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

				<button
					type='button'
					className='hm-btn hm-btn--danger hm-btn--block'
					onClick={handleConfirm}
					disabled={isLoading}
				>
					{isLoading ? 'Eliminando...' : 'Eliminar Ingrediente'}
				</button>
			</form>
		</Modal>
	);
}
