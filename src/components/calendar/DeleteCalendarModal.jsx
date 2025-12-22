import React from 'react';
import './Modal.scss';

export default function DeleteCalendarModal({ calendar, onClose, onConfirm, isLoading }) {
	const handleSubmit = (e) => {
		e.preventDefault();
		onConfirm();
	};

	return (
		<div className='popup popupstyle1 del-calendar' onClick={onClose}>
			<div className='container-popup' onClick={(e) => e.stopPropagation()}>
				<button className='close' onClick={onClose}>
					<i className='fas fa-times'></i>
				</button>
				<h3>Eliminar Calendario</h3>
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
			</div>
		</div>
	);
}

