import React, { useEffect, useState } from 'react';
import Modal from './Modal';

export default function CalendarPickerModal({
	calendars = [],
	initialCalendarId = null,
	onClose,
	onConfirm,
}) {
	const [selectedId, setSelectedId] = useState(initialCalendarId || calendars?.[0]?.id || null);

	useEffect(() => {
		setSelectedId(initialCalendarId || calendars?.[0]?.id || null);
	}, [initialCalendarId, calendars]);

	return (
		<Modal
			onClose={onClose}
			title={null}
			className='popupstyle1'
			dataModal='calendar-picker'
			width={520}
		>
			<h3 className='hm-modal__title' style={{ textAlign: 'left', marginBottom: '12px' }}>
				Seleccionar calendario
			</h3>
			<div className='form-group'>
				<p>Calendario</p>
				<select
					className='input'
					value={selectedId ?? ''}
					onChange={(e) => setSelectedId(Number(e.target.value))}
				>
					{calendars.map((calendar) => (
						<option key={calendar.id} value={calendar.id}>
							{calendar.title}
						</option>
					))}
				</select>
			</div>
			<div className='btn-group' style={{ display: 'grid', gap: '10px' }}>
				<button type='button' className='hm-btn hm-btn--outline hm-btn--block' onClick={onClose}>
					Cancelar
				</button>
				<button
					type='button'
					className='hm-btn hm-btn--primary hm-btn--block'
					disabled={!selectedId}
					onClick={() => onConfirm(selectedId)}
				>
					Continuar
				</button>
			</div>
		</Modal>
	);
}
