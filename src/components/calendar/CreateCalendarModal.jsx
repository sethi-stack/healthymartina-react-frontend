import React, { useState } from 'react';
import Modal from './Modal';

export default function CreateCalendarModal({ onClose, onSubmit, isLoading }) {
	const [nombre, setNombre] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (nombre.trim()) {
			onSubmit(nombre.trim());
		}
	};

	return (
		<Modal onClose={onClose} title='Nuevo Calendario' className='popupstyle1 add-calendar'>
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
					value={isLoading ? 'Creando...' : 'Crear calendario'}
					disabled={isLoading}
				/>
			</form>
		</Modal>
	);
}

