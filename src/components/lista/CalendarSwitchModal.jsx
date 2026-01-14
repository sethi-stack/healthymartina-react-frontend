import React, { useState } from 'react';
import Modal from '../calendar/Modal';
import '../shared/ModalForms.scss';

/**
 * CalendarSwitchModal Component
 * Modal for switching between user's calendars
 */
export default function CalendarSwitchModal({
	calendars = [],
	currentCalendarId,
	onClose,
	onSelectCalendar,
}) {
	const [selectedId, setSelectedId] = useState(currentCalendarId);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (onSelectCalendar && selectedId) {
			onSelectCalendar(parseInt(selectedId));
		}
	};

	return (
		<Modal isOpen={true} onClose={onClose} title='Mi Lista' width={540}>
			<form onSubmit={handleSubmit}>
				<label htmlFor='calendar-select'>Listas</label>
				<select
					id='calendar-select'
					value={selectedId || ''}
					onChange={(e) => setSelectedId(e.target.value)}
					className='select-ingrediente'
					required
				>
					{calendars.map((calendar) => (
						<option key={calendar.id} value={calendar.id}>
							{calendar.title || calendar.nombre}
						</option>
					))}
				</select>

				<input type='submit' value='Ver Lista' />
			</form>
		</Modal>
	);
}
