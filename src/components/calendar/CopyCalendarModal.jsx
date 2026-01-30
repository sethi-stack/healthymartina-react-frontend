import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function CopyCalendarModal({ calendar, onClose, onSubmit, isLoading }) {
	const [nombre, setNombre] = useState('');

	useEffect(() => {
		if (calendar) {
			setNombre(`${calendar.title} copia`);
		}
	}, [calendar]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (nombre.trim()) {
			onSubmit(nombre.trim());
		}
	};

	return (
		<Modal onClose={onClose} title='Nuevo Calendario' className='popupstyle1 copiar-calendar' dataModal='copy-calendar'>
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
					{isLoading ? 'Copiando...' : 'Copiar calendario'}
				</button>
			</form>
		</Modal>
	);
}

