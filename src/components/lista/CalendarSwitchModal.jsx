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
		<Modal isOpen={true} onClose={onClose} title='Mi Lista' width={540} dataModal='calendar-switch'>
			<form onSubmit={handleSubmit} className='hm-form'>
				<div className='hm-form__group'>
					<label htmlFor='calendar-select' className='hm-form__label'>Listas</label>
					<select
						id='calendar-select'
						value={selectedId || ''}
						onChange={(e) => setSelectedId(e.target.value)}
						className='hm-form__select'
						required
					>
						{calendars.map((calendar) => (
							<option key={calendar.id} value={calendar.id}>
								{calendar.title}
							</option>
						))}
					</select>
				</div>

				<button type='submit' className='hm-btn hm-btn--outline hm-btn--block'>
					Ver Lista
				</button>
			</form>
		</Modal>
	);
}
