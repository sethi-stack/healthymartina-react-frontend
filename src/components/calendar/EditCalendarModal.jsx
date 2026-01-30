import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function EditCalendarModal({ calendar, onClose, onSubmit, isLoading }) {
	const [nombre, setNombre] = useState('');

	useEffect(() => {
		if (calendar) {
			setNombre(calendar.title || '');
		}
	}, [calendar]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (nombre.trim()) {
			onSubmit(nombre.trim());
		}
	};

	return (
		<Modal onClose={onClose} title='Editar Nombre Calendario' className='popupstyle1 edit-calendar' dataModal='edit-calendar'>
			<form onSubmit={handleSubmit} className='hm-form'>
				<div className='hm-form__group'>
					<label className='hm-form__label'>Nuevo nombre</label>
					<input
						type='text'
						name='calendar_title'
						className='hm-form__input'
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
						placeholder='Nombre del calendario'
						required
					/>
				</div>
				<button
					type='submit'
					className='hm-btn hm-btn--outline hm-btn--block'
					disabled={isLoading}
				>
					{isLoading ? 'Guardando...' : 'Guardar nuevo nombre'}
				</button>
			</form>
		</Modal>
	);
}

