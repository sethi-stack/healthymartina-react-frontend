import React, { useState } from 'react';
import './Modal.scss';

export default function CreateCalendarModal({ onClose, onSubmit, isLoading }) {
	const [nombre, setNombre] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (nombre.trim()) {
			onSubmit(nombre.trim());
		}
	};

	return (
		<div className='popup popupstyle1 add-calendar' onClick={onClose}>
			<div className='container-popup' onClick={(e) => e.stopPropagation()}>
				<button className='close' onClick={onClose}>
					<i className='fas fa-times'></i>
				</button>
				<h3>Nuevo Calendario</h3>
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
			</div>
		</div>
	);
}

