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
		<Modal onClose={onClose} title='Nuevo Calendario' className='popupstyle1 add-calendar' dataModal='create-calendar'>
			<form onSubmit={handleSubmit} className='hm-form'>
				<div className='hm-form__group'>
					<label className='hm-form__label'>Nombre</label>
					<input
						type='text'
						name='calendar_title'
						className='hm-form__input'
						placeholder='Nombre del calendario'
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
						required
					/>
				</div>
				<button
					type='submit'
					className='hm-btn hm-btn--outline hm-btn--block'
					disabled={isLoading}
				>
					{isLoading ? 'Creando...' : 'Crear calendario'}
				</button>
			</form>
		</Modal>
	);
}

