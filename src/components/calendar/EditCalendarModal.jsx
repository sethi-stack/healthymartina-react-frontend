import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function EditCalendarModal({ calendar, onClose, onSubmit, isLoading }) {
	const [nombre, setNombre] = useState('');

	useEffect(() => {
		if (calendar) {
			setNombre(calendar.title || calendar.nombre || '');
		}
	}, [calendar]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (nombre.trim()) {
			onSubmit(nombre.trim());
		}
	};

	return (
		<Modal onClose={onClose} title='Editar Nombre Calendario' className='popupstyle1 edit-calendar'>
			<form onSubmit={handleSubmit}>
				<p>Nuevo nombre</p>
				<input
					type='text'
					name='calendar_title'
					className='calendar_title'
					value={nombre}
					onChange={(e) => setNombre(e.target.value)}
					placeholder='Nombre del calendario'
					required
				/>
				<input
					type='submit'
					value={isLoading ? 'Guardando...' : 'Guardar nuevo nombre'}
					disabled={isLoading}
				/>
			</form>
		</Modal>
	);
}

