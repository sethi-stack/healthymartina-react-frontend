import React from 'react';
import Modal from './Modal';

export default function DeleteCalendarModal({ calendar, onClose, onConfirm, isLoading }) {
	const handleSubmit = (e) => {
		e.preventDefault();
		onConfirm();
	};

	return (
		<Modal onClose={onClose} title='Eliminar Calendario' className='popupstyle1 del-calendar'>
			<form onSubmit={handleSubmit}>
				<div className='exclamacion'>
					<span>
						<i className='fas fa-exclamation'></i>
					</span>
					<p className='bold'>¿Estás seguro?</p>
					<p>Esta acción no se puede deshacer</p>
				</div>
				<input
					className='special'
					type='submit'
					value={isLoading ? 'Eliminando...' : 'Eliminar Calendario'}
					disabled={isLoading}
				/>
			</form>
		</Modal>
	);
}

