import React from 'react';
import Modal from './Modal';

export default function DeleteCalendarModal({ calendar, onClose, onConfirm, isLoading }) {
	const handleSubmit = (e) => {
		e.preventDefault();
		onConfirm();
	};

	return (
		<Modal onClose={onClose} title='Eliminar Calendario' className='popupstyle1 del-calendar' dataModal='delete-calendar'>
			<form onSubmit={handleSubmit} className='hm-form'>
				<div className='exclamacion hm-text--center'>
					<span>
						<i className='fas fa-exclamation'></i>
					</span>
					<p className='bold'>¿Estás seguro?</p>
					<p>Esta acción no se puede deshacer</p>
				</div>
				<button
					type='submit'
					className='hm-btn hm-btn--danger hm-btn--block'
					disabled={isLoading}
				>
					{isLoading ? 'Eliminando...' : 'Eliminar Calendario'}
				</button>
			</form>
		</Modal>
	);
}

