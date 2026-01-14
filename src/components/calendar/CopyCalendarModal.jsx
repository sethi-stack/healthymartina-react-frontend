import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function CopyCalendarModal({ calendar, onClose, onSubmit, isLoading }) {
	const [nombre, setNombre] = useState('');

	useEffect(() => {
		if (calendar) {
			setNombre(`${calendar.title || calendar.nombre} copia`);
		}
	}, [calendar]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (nombre.trim()) {
			onSubmit(nombre.trim());
		}
	};

	return (
		<Modal onClose={onClose} title={<span className='calendar-nombro'>Nuevo Calendario</span>} className='popupstyle1 copiar-calendar'>
			<form onSubmit={handleSubmit}>
				<p>Nombre</p>
				<input
					type='text'
					name='calendar_title'
					className='calendar_title'
					placeholder='Nombre del calendario'
					value={nombre}
					onChange={(e) => setNombre(e.target.value)}
					required
				/>
				<input
					type='submit'
					value={isLoading ? 'Copiando...' : 'Copiar calendario'}
					disabled={isLoading}
				/>
			</form>
		</Modal>
	);
}

